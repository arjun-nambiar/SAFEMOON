const { ethers, BigNumber, deployments, getNamedAccounts } = require("hardhat");
const { expect, assert, revert } = require("chai");
const { time, loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
let { deployment, modify_data } = require("./helper");

describe("Testing Airdrop....", function () {
    let sale,
        owner,
        user1,
        accounts,
        _preSaleAirdropCount,
        _publicSaleAirdropCount,
        _totalMint,
        _limitSupplyInPreSale,
        _maxSupply;

    let addresses = new Array();

    before(async function () {
        modify_data(
            {
                maxSupply: 50,
                limitSupplyInPreSale: 15,
                maxTokenPerMintPresale: 15,
                maxTokenPerMintPublicSale: 50,
                maxTokenPerPersonPublicSale: 50,
            },
            true
        );

        const deployed = await deployment();

        sale = deployed.NFT;

        factory = deployed.NFTFactory;

        await factory.setApproval(sale.address, {from: await factory.owner()});

        accounts = await ethers.getSigners();

        owner = accounts[0];
        user1 = accounts[1];

        for (let i = 0; i < accounts.length; i++) {
            let temp = accounts[i];

            addresses.push(temp.address);
        }

        // console.log(`Length of addresses list in Airdrop: ${addresses.length}`);

        _maxSupply = (await sale.maxSupply()).toNumber();

        _limitSupplyInPreSale = (await sale.limitSupplyInPreSale()).toNumber();

        // console.log(`Max Supply: ${_maxSupply}`);

        // console.log(`Presale Supply: ${_limitSupplyInPreSale}`);
    });

    it("should revert if the caller is not an owner", async function () {
        let shares = [addresses.length, 0];

        let tx = sale.connect(user1).createAirdrop(addresses, shares);

        await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should revert if the airdrop shares mismatch with input list of addresses", async function () {
        expect(await sale.isPreSaleLive()).to.be.false;
        let shares = [addresses.length + 1, 0];

        let tx = sale.connect(owner).createAirdrop(addresses, shares);

        await expect(tx).to.be.revertedWith("Airdrop: Presale share not in range");
    });

    it("should revert if the presale airdrop shares (e.g., 20) exceeds the presale limit", async function () {
        let isPreSalelive = await sale.isPreSaleLive();

        expect(isPreSalelive).to.equal(false);

        let shares = [addresses.length, 0];

        let tx = sale.connect(owner).createAirdrop(addresses, shares);

        await expect(tx).to.be.revertedWith("Airdrop: Presale share not in range");
    });

    it("should revert if sum of airdrop shares exceeds max Supply", async function () {
        const addresses60 = [...addresses, ...addresses, ...addresses];

        let tx = sale.connect(owner).createAirdrop(addresses60, [0, 60]);

        await expect(tx).to.be.revertedWith("Airdrop: exceeds max Supply");
    });

    it("Should Successfully airdrop before Presale, Scenario 1: Presaleshare: 15, PublicSaleShare: 5", async function () {
        let isPreSalelive = await sale.isPreSaleLive();

        expect(isPreSalelive).to.equal(false);

        console.log("--------Airdrop from Presale: 15, Public Sale: 5--------");

        assert.isOk(await sale.connect(owner).createAirdrop(addresses, [15, 5]));

        _totalMint = (await sale.totalMint()).toNumber();

        _preSaleAirdropCount = (await sale.preSaleAirdropCount()).toNumber();

        _publicSaleAirdropCount = (await sale.publicSaleAirdropCount()).toNumber();

        expect(_totalMint).to.equal(20);

        expect(_preSaleAirdropCount).to.equal(15);

        expect(_publicSaleAirdropCount).to.equal(5);
    });

    it("should revert if presale share exceeds presale limit since remainingInPresale is equal to 0", async function () {
        let shares = [1, 0];

        let tx = sale.connect(owner).createAirdrop([addresses[1]], shares);

        await expect(tx).to.be.revertedWith("Airdrop: Presale share not in range");
    });

    it("should revert if public sale share exceeds max Supply", async function () {
        const addresses40 = [...addresses, ...addresses];

        let tx = sale.connect(owner).createAirdrop(addresses40, [0, 40]);

        await expect(tx).to.be.revertedWith("Airdrop: exceeds max Supply");
    });

    it("should revert if presale is live", async function () {
        let _preSaleStartTime = await sale.preSaleStartTime();

        await time.increaseTo(_preSaleStartTime.toNumber());

        let isPreSalelive = await sale.isPreSaleLive();

        expect(isPreSalelive).to.equal(true);

        let tx = sale.connect(owner).createAirdrop([addresses[1]], [0, 1]);

        await expect(tx).to.be.revertedWith("Airdrop:Invalid Time");
    });

    it("should revert if presale airdrop share is non-zero after Presale ends", async function () {
        let _preSaleEndTime = await sale.preSaleEndTime();

        await time.increaseTo(_preSaleEndTime.toNumber() + 1);

        let isPreSalelive = await sale.isPreSaleLive();

        expect(isPreSalelive).to.equal(false);

        let tx = sale.connect(owner).createAirdrop([addresses[1]], [1, 0]);

        await expect(tx).to.be.revertedWith("Airdrop: Invalid Presale Share");
    });

    it("Sucessfully airdrop in between Presale and Publicsale", async function () {
        assert.isOk(await sale.connect(owner).createAirdrop([addresses[1]], [0, 1]));

        let _afterPublicSaleAirdropCount = (await sale.publicSaleAirdropCount()).toNumber();

        // console.log(_afterPublicSaleAirdropCount);

        // console.log(_totalMint);

        expect(_afterPublicSaleAirdropCount - _publicSaleAirdropCount).to.equal(1);
    });

    it("should revert if public sale is started", async function () {
        let _publicSaleStartTime = (await sale.publicSaleStartTime()).toNumber();

        await time.increaseTo(_publicSaleStartTime + 1);

        expect(await sale.isPublicSaleLive()).to.equal(true);

        let tx = sale.connect(owner).createAirdrop([addresses[1]], [0, 1]);

        await expect(tx).to.be.revertedWith("Airdrop:Invalid Time");
    });

    it("successfully airdrop when the public sale is ended", async function () {
        let _beforePublicSaleAirdropCount = (await sale.publicSaleAirdropCount()).toNumber();

        let _publicSaleEndTime = (await sale.publicSaleEndTime()).toNumber();

        await time.increaseTo(_publicSaleEndTime + 1);

        assert.isOk(await sale.connect(owner).createAirdrop([addresses[1]], [0, 1]));

        let _afterPublicSaleAirdropCount = (await sale.publicSaleAirdropCount()).toNumber();

        // console.log(_afterPublicSaleAirdropCount);

        expect(_afterPublicSaleAirdropCount - _beforePublicSaleAirdropCount).to.equal(1);
    });

    it("should revert when public sale airdrop count exceeds difference of maxSupply and limitSupply", async function () {
        expect(await sale.isPublicSaleLive()).to.equal(false);

        const addresses40 = [...addresses, ...addresses];

        // shares[1] < maxSupply-totalMint

        let tx = sale.connect(owner).createAirdrop(addresses40, [0, 40]);

        await expect(tx).to.be.revertedWith("Airdrop: exceeds max Supply");
    });

    it("should revert if airdrop address list includes zero address", async function () {
        expect(await sale.isPublicSaleLive()).to.equal(false);
        const ZERO = "0x0000000000000000000000000000000000000000";

        let tx = sale.connect(owner).createAirdrop([ZERO], [0, 1]);

        await expect(tx).to.be.revertedWith("Invalid recipient");
    });

    after(async function () {
        modify_data({}, false);

        sale = (await deployment()).sale;
    });
});
