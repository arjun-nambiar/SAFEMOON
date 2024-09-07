const { ethers, BigNumber, deployments, getNamedAccounts } = require("hardhat");
const { expect, assert, revert } = require("chai");
const { time, loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
let { deployment, modify_data } = require("./helper");

var Web3 = require("web3");
const web3 = new Web3("http://127.0.0.1:8545/");

let owner, whitelistedUser, buyer2, buyer3, signerAddress, buyer5, affiliatedUser, randomUser;

describe("NFT WithoutPublic Sale Buy  ---Buying NFTs during Public Sale---", async function () {
    let NFTWithoutPresale;

    let tokenSignQuantity, mintCost;

    let chainId = network.config.chainId;

    let signerPrivateKey, signature, saleId;

    before(async function () {
        signerPrivateKey = "0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a";

        let deployedContracts = await deployment();
        NFTWithoutPresale = deployedContracts.NFTWithoutPresale;
        const factory = deployedContracts.NFTFactory;
        await factory.setApproval(NFTWithoutPresale.address, {from: await factory.owner()});   

        [owner, whitelistedUser, buyer2, buyer3, signerAddress, buyer5, affiliatedUser, randomUser] =
            await ethers.getSigners();

        tokenSignQuantity = await NFTWithoutPresale.maxTokenPerMintPublicSale();

        mintCost = await NFTWithoutPresale.publicSaleMintCost();

        saleId = await NFTWithoutPresale.saleId();
    });

    it("should revert Public Sale Buying if public sale is not started", async function () {
        let tokenQuantity = 2;

        await expect(
            NFTWithoutPresale.connect(buyer2).publicSaleBuy(tokenQuantity, { value: mintCost * tokenQuantity })
        ).to.be.revertedWith("Public Sale-not live");
    });

    it("Should revert if zero value is assigned to token quantity", async function () {
        //Public Sale Start Time was set as +300 seconds to current time
        //Increasing time to start the public sale
        await time.increase(205);
        let tx = NFTWithoutPresale.connect(buyer2).publicSaleBuy(0, { value: mintCost * 1 });

        await expect(tx).to.be.revertedWith("Invalid Token Quantity");
    });

    it("Should revert if trying to mint more than allowed in one transaction in public sale", async function () {
        let tokenQuantity = tokenSignQuantity.toNumber() + 1;

        let tx = NFTWithoutPresale.connect(buyer2).publicSaleBuy(tokenQuantity, { value: mintCost * tokenQuantity });

        await expect(tx).to.be.revertedWith("Invalid Token Quantity");
    });

    it("should revert if amount paid is not enough for buy", async function () {
        let tokenQuantity = 1;

        let tx = NFTWithoutPresale.connect(buyer2).publicSaleBuy(tokenQuantity, {
            value: mintCost * tokenQuantity - 5,
        });

        await expect(tx).to.be.revertedWith("pay minimum token price");
    });

    it("Buying Single token should work", async function () {
        let tokenQuantity = 1;

        await NFTWithoutPresale.connect(buyer2).publicSaleBuy(tokenQuantity, { value: mintCost * tokenQuantity });

        let _totalMint = (await NFTWithoutPresale.totalMint()).toString();
        let _publicSalerListPurchases = await NFTWithoutPresale.publicsalerListPurchases(buyer2.address);

        expect(_totalMint).to.equal("1");

        expect(_publicSalerListPurchases.toString()).to.equal("1");
    });

    it("should correctly call public sale buy if the public-sale is started", async function () {

        let PublicSaleStartTime = await NFTWithoutPresale.publicSaleStartTime();

        await time.increaseTo(PublicSaleStartTime);

        await NFTWithoutPresale.connect(buyer2).publicSaleBuy(2, { value: mintCost * 2 });
    });

    context("Public Sale is started---Buying via Affiliated Sale", async function () {
        let commission = 20;

        beforeEach(async function () {
            await NFTWithoutPresale.maxTokenPerMintPublicSale();

            let messageHash = await web3.utils.soliditySha3(
                buyer3.address,
                chainId,
                affiliatedUser.address,
                commission,
                saleId,
                NFTWithoutPresale.address
            );

            let msg = await web3.eth.accounts.sign(messageHash, signerPrivateKey);
            signature = msg.signature;
        });

        it("should revert if buying tokenQuantity is zero", async function () {
            await expect(
                NFTWithoutPresale.connect(buyer3).publicSaleBuyAffiliated(
                    0,
                    affiliatedUser.address,
                    commission,
                    signature,
                    { value: 2020 }
                )
            ).to.be.revertedWith("Invalid Token Quantity");
        });

        it("should revert if buying tokenQuantity is greater than maxTokenPerMintPreSale", async function () {
            let _tokenQuantity = (await NFTWithoutPresale.maxTokenPerMintPublicSale()) + 20;
            await expect(
                NFTWithoutPresale.connect(buyer3).publicSaleBuyAffiliated(
                    _tokenQuantity,
                    affiliatedUser.address,
                    commission,
                    signature,
                    {
                        value: 2020,
                    }
                )
            ).to.be.revertedWith("Invalid Token Quantity");
        });

        it("should revert if sent Eth is not enough for buy", async function () {
            let tokenQuantity = 1;

            let tx = NFTWithoutPresale.connect(buyer3).publicSaleBuyAffiliated(
                tokenQuantity,
                affiliatedUser.address,
                commission,
                signature,
                { value: 900 }
            );

            await expect(tx).to.be.revertedWith("pay minimum token price");
        });

        it("Buying Single token from buyer3 via Public Sale Affiliated", async function () {
            tokenSignQuantity = await NFTWithoutPresale.maxTokenPerMintPublicSale();

            let tokenQuantity = 1;
            await NFTWithoutPresale.connect(buyer3).publicSaleBuyAffiliated(
                tokenQuantity,
                affiliatedUser.address,
                commission,
                signature,
                { value: mintCost * tokenQuantity }
            );

            let _totalMint = (await NFTWithoutPresale.totalMint()).toString();

            let _totalMintReferral = (await NFTWithoutPresale.totalMintReferral()).toString();

            expect(_totalMint).to.equal("2");
            expect(_totalMintReferral).to.equal("1");
        });

        it("Affiliated User Balance should be 200", async function () {
            let _totalMintReferral = (await NFTWithoutPresale.totalMintReferral()).toString();

            let _publicSaleMintCost = (await NFTWithoutPresale.publicSaleMintCost()).toString();

            let _affiliatedUserBalance = (_publicSaleMintCost * commission * _totalMintReferral) / 100;

            let affiliatedWei = (await NFTWithoutPresale.affiliatedWei()).toString();

            expect(affiliatedWei).to.equal(_affiliatedUserBalance.toString());

            let affiliatedUserBalance = await NFTWithoutPresale.callStatic.affiliatedUserBalance(
                affiliatedUser.address
            );
            expect(affiliatedUserBalance.toString()).to.equal(_affiliatedUserBalance.toString());
        });
    });
});
