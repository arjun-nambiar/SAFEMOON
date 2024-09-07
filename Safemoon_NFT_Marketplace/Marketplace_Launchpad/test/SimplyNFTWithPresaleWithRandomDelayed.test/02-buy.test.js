const { ethers, BigNumber, deployments, getNamedAccounts, network } = require("hardhat");
const { expect, assert, revert } = require("chai");
const { time, loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
let { deployment, modify_data, params } = require("./helper");

var Web3 = require("web3");
const web3 = new Web3("http://127.0.0.1:8545/");

let owner, whitelistedUser, buyer2, buyer3, signerAddress, buyer5, affiliatedUser, randomUser;

describe("Buying NFTs during Presale...", function () {
    let sale, factory;

    let tokenSignQuantity, saleId;

    let chainId = network.config.chainId;

    let signerAddress, signerPrivateKey, signature;

    before(async function () {
        signerPrivateKey = "0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a";

        const deployed = (await loadFixture(deployment));

        sale = deployed.NFT;

        factory = deployed.NFTFactory;

        await factory.setApproval(sale.address, {from: await factory.owner()});

        [owner, whitelistedUser, buyer2, buyer3, signerAddress, buyer5, affiliatedUser, randomUser] =
            await ethers.getSigners();

        tokenSignQuantity = await sale.maxTokenPerMintPreSale();

        saleId = await sale.saleId();

        let messageHash = await web3.utils.soliditySha3(
            whitelistedUser.address,
            chainId,
            tokenSignQuantity.toNumber(),
            saleId,
            sale.address
        );

        let _sig = await web3.eth.accounts.sign(messageHash, signerPrivateKey);

        //Signature of whitelistedUser
        signature = _sig.signature;
    });


    it("should revert if nftDrop is not approved by admin", async function(){

        let tokenQuantity = 2;

        await expect(
            sale
                .connect(whitelistedUser)
                .preSaleBuy(tokenSignQuantity.toNumber(), tokenQuantity, signature, { value: 1020 })
        ).to.be.revertedWith("presale is not live");
    })

    it("should revert Presale Buying if presale is not started", async function () {

        let tokenQuantity = 2;

        await expect(
            sale
                .connect(whitelistedUser)
                .preSaleBuy(tokenSignQuantity.toNumber(), tokenQuantity, signature, { value: 1020 })
        ).to.be.revertedWith("presale is not live");
    });

    it("Should revert if zero value is assigned to token sign quantity", async function () {
        //PreSale Start Time was set as +300 seconds to current time
        //Increasing time to start the presale
        await time.increase(205);

        //Creating new signature of whitelistedUser with 0 token Sign Quantity
        const hash = await web3.utils.soliditySha3(whitelistedUser.address, chainId, 0, saleId, sale.address);

        let msg = await web3.eth.accounts.sign(hash, signerPrivateKey);

        let tx = sale.connect(whitelistedUser).preSaleBuy(0, 1, msg.signature, { value: 1020 });

        await expect(tx).to.be.revertedWith("TokenSignQuantity > 0");
    });

    it("Should revert if non-whitelisted user trying to purchase with other whitelisted user Signature", async function () {
        await expect(
            sale.connect(buyer2).preSaleBuy(tokenSignQuantity.toNumber(), 1, signature, { value: 1020 })
        ).to.be.revertedWith("invalid-signature");
    });

    it("Should revert if whitelisted user trying to purchase with any random Signature", async function () {
        let hash = await web3.utils.soliditySha3(
            whitelistedUser.address,
            chainId,
            tokenSignQuantity.toNumber(),
            saleId,
            sale.address
        );

        let randomUserPrivateKey = "0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba";

        let malicious = await web3.eth.accounts.sign(hash, randomUserPrivateKey);

        let tokenQuantity = 1;

        await expect(
            sale
                .connect(whitelistedUser)
                .preSaleBuy(tokenSignQuantity.toNumber(), tokenQuantity, malicious.signature, { value: 1020 })
        ).to.be.revertedWith("invalid-signature");
    });

    it("should revert if the buying tokenQuantity is equal to zero", async function () {
        let tx = sale.connect(whitelistedUser).preSaleBuy(tokenSignQuantity.toNumber(), 0, signature, { value: 1020 });

        await expect(tx).to.be.revertedWith("Invalid Token Quantity");
    });

    it("Should revert if trying to mint more than allowed in one transaction in preSale", async function () {
        let tokenQuantity = tokenSignQuantity.toNumber() + 1;

        let tx = sale
            .connect(whitelistedUser)
            .preSaleBuy(tokenSignQuantity.toNumber(), tokenQuantity, signature, { value: 4020 });

        await expect(tx).to.be.revertedWith("Invalid Token Quantity");
    });

    it("should revert if amount paid is not enough for buy", async function () {
        let tokenQuantity = 1;

        let tx = sale
            .connect(whitelistedUser)
            .preSaleBuy(tokenSignQuantity.toNumber(), tokenQuantity, signature, { value: 900 });

        await expect(tx).to.be.revertedWith("insufficient Amount paid");
    });

    // it("should revert if tokenQuantity exceeds allowed limit in presale", async function () {
    //     await sale.connect(owner).updatePreSale(
    //         params.preSaleMintCost,
    //         params.preSaleStartTime,
    //         params.preSaleDuration,
    //         params.limitSupplyInPreSale, //Setting limitSupplyInPresale as MaxTokenPerMintPresale
    //         params.limitSupplyInPreSale,
    //         params.publicSaleMintCost,
    //         params.publicSaleBufferDuration,
    //         params.publicSaleDuration,
    //         params.maxTokenPerMintPublicSale,
    //         params.maxTokenPerPersonPublicSale
    //     );
    //     // Buying One Token by whitelistedUser
    //     await sale.connect(whitelistedUser).preSaleBuy(tokenSignQuantity.toNumber(), 1, signature, { value: 1020 });

    //     let _totalMint = (await sale.totalMint()).toString();

    //     expect(_totalMint).to.equal("1");

    //     tokenSignQuantity = await sale.maxTokenPerMintPreSale();

    //     let tokenQuantity = tokenSignQuantity.toNumber();

    //     // let hash = await web3.utils.soliditySha3(whitelistedUser.address, chainId, tokenQuantity, saleId, sale.address);

    //     // _sig = await web3.eth.accounts.sign(hash, signerPrivateKey);

    //     // signature = _sig.signature;

    //     console.log(signature)

    //     //Buying all Presale Limit in one transaction
    //     let tx = sale
    //         .connect(whitelistedUser)
    //         .preSaleBuy(tokenSignQuantity.toNumber(), tokenQuantity, signature, { value: 50400 });

    //     await expect(tx).to.be.revertedWith("can't be purchased as exceed limitSupplyInPreSale supply");
    // });

    it("Buying Single token should work", async function () {
        let tokenQuantity = 1;

        await sale
            .connect(whitelistedUser)
            .preSaleBuy(tokenSignQuantity.toNumber(), tokenQuantity, signature, { value: 1020 });

        let _totalMint = (await sale.totalMint()).toString();
        let _presalerListPurchases = await sale.presalerListPurchases(whitelistedUser.address);

        expect(_totalMint).to.equal("1");

        expect(_presalerListPurchases.toString()).to.equal("1");
    });

    it("Update Signer Address and then buy by another whitelisted user", async function () {
        await time.increase(20);

        //First Updating Signer Address (Making whitelistedUser as signerAddress)
        await sale.connect(owner).updateSignerAddress(buyer3.address);
        //Private Key of Buyer2
        signerPrivateKey = "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6";

        let tokenQuantity = 1;

        let hash = await web3.utils.soliditySha3(
            buyer2.address,
            chainId,
            tokenSignQuantity.toNumber(),
            saleId,
            sale.address
        );

        let msg = await web3.eth.accounts.sign(hash, signerPrivateKey);

        //Buying a single token by Buyer2
        await assert.isOk(
            sale.connect(buyer2).preSaleBuy(tokenSignQuantity.toNumber(), tokenQuantity, msg.signature, { value: 1020 })
        );

        let _presalerListPurchases = await sale.presalerListPurchases(buyer2.address);

        await expect(_presalerListPurchases.toString()).to.equal("1");
    });

    context("Presale is started---Buying via Affiliated Sale", async function () {
        let commission = 20;

        beforeEach(async function () {
            tokenSignQuantity = await sale.maxTokenPerMintPreSale();

            let messageHash = await web3.utils.soliditySha3(
                buyer3.address,
                chainId,
                tokenSignQuantity.toNumber(),
                affiliatedUser.address,
                commission,
                saleId,
                sale.address
            );

            // console.log(await sale.signerAddress());
            let msg = await web3.eth.accounts.sign(messageHash, signerPrivateKey);
            signature = msg.signature;
        });

        it("should revert if buying tokenQuantity is zero", async function () {
            await expect(
                sale
                    .connect(buyer3)
                    .preSaleBuyAffiliated(
                        tokenSignQuantity.toNumber(),
                        0,
                        affiliatedUser.address,
                        commission,
                        signature,
                        { value: 2020 }
                    )
            ).to.be.revertedWith("Invalid Token Quantity");
        });

        it("should revert if buying tokenQuantity is greater than maxTokenPerMintPreSale", async function () {
            let _tokenQuantity = (await sale.maxTokenPerMintPreSale()) + 20;
            await expect(
                sale
                    .connect(buyer3)
                    .preSaleBuyAffiliated(
                        tokenSignQuantity.toNumber(),
                        _tokenQuantity,
                        affiliatedUser.address,
                        commission,
                        signature,
                        { value: 8020 }
                    )
            ).to.be.revertedWith("Invalid Token Quantity");
        });

        it("should revert if sent Eth is not enough for buy", async function () {
            let tokenQuantity = 1;

            let tx = sale
                .connect(buyer3)
                .preSaleBuyAffiliated(
                    tokenSignQuantity.toNumber(),
                    tokenQuantity,
                    affiliatedUser.address,
                    commission,
                    signature,
                    { value: 900 }
                );

            await expect(tx).to.be.revertedWith("insufficient amount paid");
        });

        it("should revert if tokenQuantity exceeds allowed limit", async function () {
            // Buying One Token
            await sale
                .connect(buyer3)
                .preSaleBuyAffiliated(tokenSignQuantity.toNumber(), 1, affiliatedUser.address, commission, signature, {
                    value: 1020,
                });

            let tokenQuantity = tokenSignQuantity.toNumber();
            //Buying all Presale Limit
            let tx = sale
                .connect(buyer3)
                .preSaleBuyAffiliated(
                    tokenSignQuantity.toNumber(),
                    tokenQuantity,
                    affiliatedUser.address,
                    commission,
                    signature,
                    { value: 50400 }
                );

            await expect(tx).to.be.revertedWith("exceeds maximum allowed limit");

            let _totalMint = (await sale.totalMint()).toString();

            let _totalMintReferral = (await sale.totalMintReferral()).toString();

            expect(_totalMint).to.equal("3");
            expect(_totalMintReferral).to.equal("1");
        });

        it("Buying Single token from buyer3 via PresaleAffiliated", async function () {
            tokenSignQuantity = await sale.maxTokenPerMintPreSale();

            let tokenQuantity = 1;
            let tx = await sale
                .connect(buyer3)
                .preSaleBuyAffiliated(
                    tokenSignQuantity.toNumber(),
                    tokenQuantity,
                    affiliatedUser.address,
                    commission,
                    signature,
                    { value: 1020 }
                );

            let _totalMint = (await sale.totalMint()).toString();

            let _totalMintReferral = (await sale.totalMintReferral()).toString();

            expect(_totalMint).to.equal("4");
            expect(_totalMintReferral).to.equal("2");
        });

        it("Affiliated User Balance should be 400", async function () {
            let _totalMintReferral = (await sale.totalMintReferral()).toString();

            let _preSaleMintCost = (await sale.preSaleMintCost()).toString();

            // console.log(_preSaleMintCost);

            let _affiliatedUserBalance = (_preSaleMintCost * commission * _totalMintReferral) / 100;

            let affiliatedWei = (await sale.affiliatedWei()).toString();

            expect(affiliatedWei).to.equal(_affiliatedUserBalance.toString());

            let affiliatedUserBalance = await sale.callStatic.affiliatedUserBalance(affiliatedUser.address);

            // console.log(affiliatedUserBalance.toString());

            expect(affiliatedUserBalance.toString()).to.equal(_affiliatedUserBalance.toString());
        });
    });

    context("Buying NFTs in Public Sale...", function () {
        it("should revert Public Sale Buying if presale is not ended", async function () {
            let tokenQuantity = 2;

            await expect(
                sale.connect(whitelistedUser).publicSaleBuy(tokenQuantity, { value: 1020 })
            ).to.be.revertedWith("the pre-sale is not yet ended");
        });

        it("should revert Public Sale Buying if public sale has not started", async function () {
            let preSaleEndTime = (await sale.preSaleEndTime()).toNumber();

            // console.log(preSaleEndTime);

            let remainingPresaleTime = preSaleEndTime - (await time.latest());

            await time.increase(remainingPresaleTime + 30);

            let tokenQuantity = 2;

            await expect(
                sale.connect(whitelistedUser).publicSaleBuy(tokenQuantity, { value: 1020 })
            ).to.be.revertedWith("Public Sale-not live");
        });

        it("should perform buying if public sale is started", async function () {
            //Increasing time to start public Sale
            await time.increase(30);

            let tokenQuantity = 2;

            await assert.isOk(sale.connect(whitelistedUser).publicSaleBuy(tokenQuantity, { value: 1020 }));
        });

        it("should revert if tokenQuantity is equal to zero", async function () {
            let tokenQuantity = 0;

            await expect(
                sale.connect(whitelistedUser).publicSaleBuy(tokenQuantity, { value: 1020 })
            ).to.be.revertedWith("Invalid Token Quantity");
        });
    });
});
