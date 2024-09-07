const { ethers, BigNumber, deployments, getNamedAccounts } = require("hardhat");
const { expect, assert, revert } = require("chai");
const { time, loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
let { deployment, modify_data } = require("./helper");

describe("init function for Without Presale", function () {
    let NFTWithoutPresale;

    before(async function () {
        let deployedContracts = await deployment();
        NFTWithoutPresale = deployedContracts.NFTWithoutPresale;
        const factory = deployedContracts.NFTFactory;
        await factory.setApproval(NFTWithoutPresale.address, {from: await factory.owner()});   
    });

    it("Should have correct max correct name, symbol basuri, sale ID and signer Address", async function () {
        let signerAddress = (await getNamedAccounts()).signerAddress;
        let deployer = (await getNamedAccounts()).deployer;

        const _name = await NFTWithoutPresale.name();
        const _symbol = await NFTWithoutPresale.symbol();
        const _baseUri = await NFTWithoutPresale.baseUri();
        const _uri = await NFTWithoutPresale.uri(1);
        const _owner = await NFTWithoutPresale.owner();
        const _signerAddress = await NFTWithoutPresale.signerAddress();

        expect(_name).to.equal("Example");
        expect(_symbol).to.equal("EXPL");
        expect(_baseUri).to.equal("https://example.com/");
        expect(_uri).to.equal("https://example.com/1");
        expect(_signerAddress).to.equal(signerAddress);
        expect(_owner).to.equal(deployer);
        expect(_signerAddress).to.equal(signerAddress);
    });

    it("max supply should be in range 0-100000", async function () {
        const _maxSupply = await NFTWithoutPresale.maxSupply();

        expect(_maxSupply).to.be.within(0, 100000);
    });

    it("public sale mint cost should be greater than 100", async function () {
        const _publicSaleMintCost = await NFTWithoutPresale.publicSaleMintCost();

        expect(_publicSaleMintCost).to.greaterThanOrEqual(ethers.utils.parseUnits("100", "wei"));
    });

    it("Public sale start time should be greater than current time", async function () {
        const _publicSaleStartTime = await NFTWithoutPresale.publicSaleStartTime();

        expect(_publicSaleStartTime).to.greaterThan(await time.latest());
    });

    it("Public sale duration greater than zero", async function () {
        const _publicSaleStartTime = await NFTWithoutPresale.publicSaleStartTime();
        const _publicSaleEndTime = await NFTWithoutPresale.publicSaleEndTime();

        expect(_publicSaleEndTime - _publicSaleStartTime).to.equal(120);
    });

    it("Max Token per mint public sale greater than zero", async function () {
        const _maxTokenPerMintPublicSale = await NFTWithoutPresale.maxTokenPerMintPublicSale();

        expect(_maxTokenPerMintPublicSale).to.greaterThan(0);
    });

    it("Max Token per person public sale greater than zero", async function () {
        const _maxTokenPerPersonPublicSale = await NFTWithoutPresale.maxTokenPerPersonPublicSale();

        expect(_maxTokenPerPersonPublicSale).to.greaterThan(0);
    });

    context("reverting scenarios", function () {
        afterEach(async function () {
            modify_data({}, false);
        });

        // it("revert if max supply is greater than 1L", async function () {
        //     modify_data({ maxSupply: 100002 }, true);

        //     await expect(deployment()).to.be.revertedWith("Init: Invalid max supply");
        // });

        it("revert if public sale mint cost is set to less than 100 wei (e.g., 90 wei)", async function () {
            modify_data({ publicSaleMintCost: 90 }, true);

            await expect(deployment()).to.be.revertedWith("Init: Invalid Token cost");
        });
    });
});
