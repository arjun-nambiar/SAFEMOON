const { ethers } = require("hardhat");
const { expect, assert, revert } = require("chai");
const { time, loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
let { deployment, modify_data } = require("./helper");

var Web3 = require("web3");
const web3 = new Web3("http://127.0.0.1:8545/");

describe("Scenario Testing...", function () {
    let NFTWithoutPresale, owner, whitelistedUser, affiliatedUser, accounts, _maxSupply, signerPrivateKey, saleId;

    let addresses = new Array();

    let chainId = network.config.chainId;

    before(async function () {
        modify_data(
            {
                maxSupply: 150,
                maxTokenPerMintPublicSale: 100,
                maxTokenPerPersonPublicSale: 150,
            },
            true
        );

        let deployedContracts = await deployment();
        NFTWithoutPresale = deployedContracts.NFTWithoutPresale;
        const factory = deployedContracts.NFTFactory;
        await factory.setApproval(NFTWithoutPresale.address, {from: await factory.owner()});
        accounts = await ethers.getSigners();

        owner = accounts[0];
        whitelistedUser = accounts[1];
        affiliatedUser = accounts[2];
        user1 = accounts[3];

        signerPrivateKey = "0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a";

        for (let i = 0; i < accounts.length; i++) {
            let temp = accounts[i];

            addresses.push(temp.address);
        }

        _maxSupply = (await NFTWithoutPresale.maxSupply()).toNumber();

        saleId = await NFTWithoutPresale.saleId();
    });

    it("Airdropping 100 NFTs", async function () {
        let shares = [0, 100];

        let addresses100 = [...addresses, ...addresses, ...addresses, ...addresses, ...addresses];

        assert.isOk(await NFTWithoutPresale.connect(owner).createAirdrop(addresses100, shares));

        let _totalMint = (await NFTWithoutPresale.totalMint()).toNumber();

        expect(_totalMint).to.equal(100);
    });

    it("Should revert public sale buy if the public sale is not started", async function () {
        let tokenQuantity = 2;

        const mintCost = await NFTWithoutPresale.publicSaleMintCost();

        await expect(
            NFTWithoutPresale.connect(user1).publicSaleBuy(tokenQuantity, { value: mintCost * tokenQuantity })
        ).to.be.revertedWith("Public Sale-not live");
    });

    it("Should Successfully buy in public sale after the public sale is started", async function () {
        const tokenQuantity = 2;

        const _publicSaleStartTime = (await NFTWithoutPresale.publicSaleStartTime()).toNumber();

        const _totalMint = (await NFTWithoutPresale.totalMint()).toNumber();

        //Starting the Public Sale
        await time.increaseTo(_publicSaleStartTime + 10);

        _publicsalelive = await NFTWithoutPresale.isPublicSaleLive();

        expect(_publicsalelive).to.be.true;

        let _publicSaleMintCost = (await NFTWithoutPresale.publicSaleMintCost()).toNumber();

        assert.isOk(
            await NFTWithoutPresale.connect(user1).publicSaleBuy(tokenQuantity, { value: _publicSaleMintCost * 10 })
        );

        let _postotalMint = (await NFTWithoutPresale.totalMint()).toNumber();

        expect(_postotalMint - _totalMint).to.equal(2);
    });

    it("should revert if the user tries to buy more than max transaction limit", async function () {
        let tokenQuantity = (await NFTWithoutPresale.maxTokenPerMintPublicSale()).toNumber();

        let tx = NFTWithoutPresale.connect(user1).publicSaleBuy(tokenQuantity, { value: 6020 });

        await expect(tx).to.be.revertedWith("exceed max supply.");
    });

    it("should success if the user buyes token under the max transaction limit", async function () {
        const tokenQuantity = 3;

        const _totalMint = (await NFTWithoutPresale.totalMint()).toNumber();

        const _publicSaleMintCost = (await NFTWithoutPresale.publicSaleMintCost()).toNumber();

        assert.isOk(
            await NFTWithoutPresale.connect(user1).publicSaleBuy(tokenQuantity, { value: _publicSaleMintCost * 3 })
        );

        const _postotalMint = (await NFTWithoutPresale.totalMint()).toNumber();

        expect(_postotalMint - _totalMint).to.equal(3);
    });

    it("should successfully perform affiliated buy in public sale", async function () {
        const commission = 80;

        const tokenQuantity = 4;
        const _totalMint = (await NFTWithoutPresale.totalMint()).toNumber();
        const _publicSaleMintCost = (await NFTWithoutPresale.publicSaleMintCost()).toNumber();

        const messageHash = await web3.utils.soliditySha3(
            user1.address,
            chainId,
            affiliatedUser.address,
            commission,
            saleId,
            NFTWithoutPresale.address
        );

        const msg = await web3.eth.accounts.sign(messageHash, signerPrivateKey);

        await NFTWithoutPresale.connect(user1).publicSaleBuyAffiliated(
            tokenQuantity,
            affiliatedUser.address,
            commission,
            msg.signature,
            {
                value: _publicSaleMintCost * tokenQuantity,
            }
        );

        const _postotalMint = (await NFTWithoutPresale.totalMint()).toNumber();

        expect(_postotalMint - _totalMint).to.equal(4);
    });

    it("Should successfully transfer ownership to correct address", async function () {
        const _newOwner = accounts[1];

        assert.isOk(await NFTWithoutPresale.connect(owner).transferOwnership(_newOwner.address));

        const _owner = await NFTWithoutPresale.owner();

        expect(_owner).to.equal(_newOwner.address);

        owner = _newOwner;
    });

    it("Should revert if any one tries to withdraw eth from contract.", async function () {
        const tx = NFTWithoutPresale.connect(affiliatedUser).withdrawWei(1);

        await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should revert if owner tries to withdraw zero eth.", async function () {
        const tx = NFTWithoutPresale.connect(owner).withdrawWei(0);

        await expect(tx).to.be.revertedWith("Amount>0");
    });

    it("Should revert if owner tries to withdraw more eth than available (total-affiliatedWei)", async function () {
        const balance = await ethers.provider.getBalance(NFTWithoutPresale.address);

        const tx = NFTWithoutPresale.connect(owner).withdrawWei(balance);

        await expect(tx).to.be.revertedWith("Not enough eth");
    });

    it("Successfully withdraw eth available (total-affiliatedWei)", async function () {
        const _affiliatedWei = (await NFTWithoutPresale.affiliatedWei()).toNumber();

        const balance = await ethers.provider.getBalance(NFTWithoutPresale.address);

        assert.isOk(NFTWithoutPresale.connect(owner).withdrawWei(balance - _affiliatedWei));
    });

    it("Successfully transfer funds to affiliated user", async function () {
        const _publicSaleEndTime = (await NFTWithoutPresale.publicSaleEndTime()).toNumber();
        await time.increaseTo(_publicSaleEndTime + 10);

        const _affiliatedWei = (await NFTWithoutPresale.affiliatedWei()).toNumber();

        const _affiliatedUserBalance = await NFTWithoutPresale.affiliatedUserBalance(affiliatedUser.address);

        assert.isOk(await NFTWithoutPresale.connect(owner).transferAffiliatedFunds([affiliatedUser.address]));

        expect(_affiliatedUserBalance.toNumber()).to.equal(_affiliatedWei);

        expect((await NFTWithoutPresale.affiliatedWei()).toNumber()).to.equal(0);
    });
});
