const { ethers, BigNumber, deployments, getNamedAccounts } = require("hardhat");
const { expect, assert, revert } = require("chai");
const { time, loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
let { deployment, modify_data } = require("./helper");

async function setTime() {
    return (await time.latest()) + 300;
}

let _publicSaleMintCost = 500;
let _publicSaleStartTime = setTime();
let _publicSaleDuration = 36000;
let _maxTokenPerMintPublicSale = 2;
let _maxTokenPerPersonPublicSale = 8;

let owner, user1, user2;

describe("NFT UpdateWithoutPresale", async function () {
    before(async function () {
        [owner, user1, user2] = await ethers.getSigners();
    });

    it("revert if updating public sale is called by non-owner", async function () {
        const { NFTWithoutPresale } = await loadFixture(deployment);

        let tx = NFTWithoutPresale.connect(user2).updatePublicSale(
            _publicSaleMintCost,
            _publicSaleStartTime,
            _publicSaleDuration,
            _maxTokenPerMintPublicSale,
            _maxTokenPerPersonPublicSale
        );

        await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should correctly call update public sale if the public-sale is not started", async function () {
        const { NFTWithoutPresale } = await loadFixture(deployment);

        let publicSaleStartTime = (await NFTWithoutPresale.publicSaleStartTime()).toNumber();

        await time.increaseTo(publicSaleStartTime - 5);

        await NFTWithoutPresale.connect(owner).updatePublicSale(
            _publicSaleMintCost,
            _publicSaleStartTime,
            _publicSaleDuration,
            _maxTokenPerMintPublicSale,
            _maxTokenPerPersonPublicSale
        );
    });

    it("revert if public sale duration is set as zero", async function () {
        const { NFTWithoutPresale } = await loadFixture(deployment);

        let tx = NFTWithoutPresale.connect(owner).updatePublicSale(
            _publicSaleMintCost,
            _publicSaleStartTime,
            0,
            _maxTokenPerMintPublicSale,
            _maxTokenPerPersonPublicSale
        );

        await expect(tx).to.be.revertedWith("Public sale duration>0");
    });

    it("public sale mint cost should be greater than 100 wei", async function () {
        const { NFTWithoutPresale } = await loadFixture(deployment);

        await NFTWithoutPresale.connect(owner).updatePublicSale(
            _publicSaleMintCost,
            _publicSaleStartTime,
            _publicSaleDuration,
            _maxTokenPerMintPublicSale,
            _maxTokenPerPersonPublicSale
        );

        expect(await NFTWithoutPresale.publicSaleMintCost()).to.greaterThan(100);
    });

    it("revert if public sale mint cost is less than 100 wei", async function () {
        const { NFTWithoutPresale } = await loadFixture(deployment);

        let tx = NFTWithoutPresale.connect(owner).updatePublicSale(
            90,
            _publicSaleStartTime,
            _publicSaleDuration,
            _maxTokenPerMintPublicSale,
            _maxTokenPerPersonPublicSale
        );

        await expect(tx).to.be.revertedWith("Invalid Token cost");
    });

    it("Max Token per mint in public sale should be greater than zero", async function () {
        const { NFTWithoutPresale } = await loadFixture(deployment);

        await NFTWithoutPresale.connect(owner).updatePublicSale(
            _publicSaleMintCost,
            _publicSaleStartTime,
            _publicSaleDuration,
            _maxTokenPerMintPublicSale,
            _maxTokenPerPersonPublicSale
        );

        expect(await NFTWithoutPresale.maxTokenPerMintPublicSale()).to.greaterThan(0);
    });

    it("Max token per person should be greater than Max token per mint in public sale", async function () {
        const { NFTWithoutPresale } = await loadFixture(deployment);

        await NFTWithoutPresale.connect(owner).updatePublicSale(
            _publicSaleMintCost,
            _publicSaleStartTime,
            _publicSaleDuration,
            _maxTokenPerMintPublicSale,
            _maxTokenPerPersonPublicSale
        );

        expect(await NFTWithoutPresale.maxTokenPerPersonPublicSale()).to.greaterThanOrEqual(
            await NFTWithoutPresale.maxTokenPerMintPublicSale()
        );
    });

    it("revert if new public sale start time is less than current time", async function () {
        const { NFTWithoutPresale } = await loadFixture(deployment);

        let _newTime = (await time.latest()) - 1;

        let tx = NFTWithoutPresale.connect(owner).updatePublicSale(
            _publicSaleMintCost,
            _newTime,
            _publicSaleDuration,
            _maxTokenPerMintPublicSale,
            _maxTokenPerPersonPublicSale
        );

        await expect(tx).to.be.revertedWith("Invalid Start Time");
    });

    it("Should revert update uri function if it's not called by non-owner", async function () {
        const { NFTWithoutPresale } = await loadFixture(deployment);

        let tx = NFTWithoutPresale.connect(user1).updateURI("http://example5.com");

        await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should revert update signer function if it's not called by non-owner", async function () {
        const { NFTWithoutPresale } = await loadFixture(deployment);

        let tx = NFTWithoutPresale.connect(user1).updateSignerAddress(user2.address);

        await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should revert update signer function if the new signer is zero address", async function () {
        const { NFTWithoutPresale } = await loadFixture(deployment);

        const ZERO = "0x0000000000000000000000000000000000000000";

        let tx = NFTWithoutPresale.connect(owner).updateSignerAddress(ZERO);

        await expect(tx).to.be.revertedWith("Invalid Signer");
    });

    it("revert if update version function is called by non-owner", async function () {
        const { NFTWithoutPresale } = await loadFixture(deployment);

        let tx = NFTWithoutPresale.connect(user1).setVersion(2);

        await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("successfully update version function is called by non-owner", async function () {
        const { NFTWithoutPresale } = await loadFixture(deployment);

        assert.isOk(await NFTWithoutPresale.connect(owner).setVersion(2));

        const _version = await NFTWithoutPresale.version();

        expect(_version).to.be.equal(2);
    });
});
