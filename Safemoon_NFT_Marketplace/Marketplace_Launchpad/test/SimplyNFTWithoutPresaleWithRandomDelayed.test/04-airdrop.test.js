const { ethers, BigNumber, deployments, getNamedAccounts } = require("hardhat");
const { expect, assert, revert } = require("chai");
const { time, loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
let { deployment, modify_data } = require("./helper");

describe("Testing Airdrop for Without Presale....", function () {
    let NFTWithoutPresale,
        owner,
        user1,
        accounts,
        _preSaleAirdropCount,
        _publicSaleAirdropCount,
        _totalMint,
        _maxSupply;

    let addresses = new Array();

    before(async function () {
        modify_data(
            {
                maxSupply: 50,
                maxTokenPerMintPublicSale: 50,
                maxTokenPerPersonPublicSale: 50,
            },
            true
        );

        let deployedContracts = await deployment();
        NFTWithoutPresale = deployedContracts.NFTWithoutPresale;
        const factory = deployedContracts.NFTFactory;
        await factory.setApproval(NFTWithoutPresale.address, {from: await factory.owner()});
        accounts = await ethers.getSigners();

        owner = accounts[0];
        user1 = accounts[1];

        for (let i = 0; i < accounts.length; i++) {
            let temp = accounts[i];

            addresses.push(temp.address);
        }

        console.log(`Length of addresses list in Airdrop: ${addresses.length}`);

        _maxSupply = (await NFTWithoutPresale.maxSupply()).toNumber();

        console.log(`Max Supply: ${_maxSupply}`);
    });

    it("should revert if the caller is not an owner", async function () {
        let shares = [0, addresses.length];

        let tx = NFTWithoutPresale.connect(user1).createAirdrop(addresses, shares);

        await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should revert if the airdrop shares mismatch with input list of addresses", async function () {
        let shares = [0, addresses.length + 1];

        let tx = NFTWithoutPresale.connect(owner).createAirdrop(addresses, shares);

        await expect(tx).to.be.revertedWith("Airdrop: Mismatch-Input");
    });

    it("should revert if sum of airdrop shares exceeds max Supply", async function () {
        const addresses60 = [...addresses, ...addresses, ...addresses];

        let tx = NFTWithoutPresale.connect(owner).createAirdrop(addresses60, [0, 60]);

        await expect(tx).to.be.revertedWith("Airdrop: exceeds max Supply");
    });

    it("should successfully airdrop before Public Sale", async function () {
        let isPublicSalelive = await NFTWithoutPresale.isPublicSaleLive();

        expect(isPublicSalelive).to.equal(false);

        assert.isOk(await NFTWithoutPresale.connect(owner).createAirdrop(addresses, [0, 20]));

        _totalMint = (await NFTWithoutPresale.totalMint()).toNumber();

        expect(_totalMint).to.equal(20);
    });

    it("should revert if public sale share exceeds max Supply", async function () {
        const addresses40 = [...addresses, ...addresses];

        let tx = NFTWithoutPresale.connect(owner).createAirdrop(addresses40, [0, 40]);

        await expect(tx).to.be.revertedWith("Airdrop: exceeds max Supply");
    });

    it("should revert if public sale is started", async function () {
        let _publicSaleStartTime = (await NFTWithoutPresale.publicSaleStartTime()).toNumber();

        await time.increaseTo(_publicSaleStartTime + 1);

        expect(await NFTWithoutPresale.isPublicSaleLive()).to.equal(true);

        let tx = NFTWithoutPresale.connect(owner).createAirdrop([addresses[1]], [0, 1]);

        await expect(tx).to.be.revertedWith("Airdrop:Invalid Time");
    });

    it("successfully airdrop when the public sale is ended", async function () {
        let totalMintBeforeAirdrop = (await NFTWithoutPresale.totalMint()).toNumber();

        let _publicSaleEndTime = (await NFTWithoutPresale.publicSaleEndTime()).toNumber();

        await time.increaseTo(_publicSaleEndTime + 1);

        assert.isOk(await NFTWithoutPresale.connect(owner).createAirdrop([addresses[1]], [0, 1]));

        let totalMintAfterAirdrop = (await NFTWithoutPresale.totalMint()).toNumber();

        expect(totalMintAfterAirdrop - totalMintBeforeAirdrop).to.equal(1);
    });

    it("should revert when public sale airdrop count exceeds difference of maxSupply and limitSupply", async function () {
        expect(await NFTWithoutPresale.isPublicSaleLive()).to.equal(false);

        const addresses40 = [...addresses, ...addresses];

        let tx = NFTWithoutPresale.connect(owner).createAirdrop(addresses40, [0, 40]);

        await expect(tx).to.be.revertedWith("Airdrop: exceeds max Supply");
    });

    it("should revert if airdrop address list includes zero address", async function () {
        expect(await NFTWithoutPresale.isPublicSaleLive()).to.equal(false);
        const ZERO = "0x0000000000000000000000000000000000000000";

        let tx = NFTWithoutPresale.connect(owner).createAirdrop([ZERO], [0, 1]);

        await expect(tx).to.be.revertedWith("Invalid recipient");
    });

    it("should sucessfully airdrop remaining NFTs", async function () {
        expect(await NFTWithoutPresale.isPublicSaleLive()).to.equal(false);

        let addresses10 = new Array();

        for (let i = 0; i < 9; i++) {
            let temp = accounts[i];

            addresses10.push(temp.address);
        }
        const addresses29 = [...addresses, ...addresses10];

        assert.isOk(await NFTWithoutPresale.connect(owner).createAirdrop(addresses29, [0, 29]));
    });

    after(async function () {
        modify_data({}, false);

        NFTWithoutPresale = (await deployment()).NFTWithoutPresale;
    });
});
