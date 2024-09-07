const { ethers, BigNumber, deployments, getNamedAccounts } = require("hardhat");
const { expect, assert, revert } = require("chai");
const { time, loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
let { deployment, modify_data } = require("./helper");

async function setTime() {
    return (await time.latest()) + 300;
}

let _preSaleMintCost = 500;
let _publicSaleMintCost = 500;
let _preSaleStartTime = setTime();
let _preSaleDuration = 30;
let _publicSaleBufferDuration = 30;
let _publicSaleDuration = 300;
let _maxTokenPerMintPresale = 1;
let _maxTokenPerMintPublicSale = 1;
let _maxTokenPerPersonPublicSale = 1;
let _limitSupplyInPreSale = 300;

let owner, user1, user2;

describe("Testing Update Presale...", function () {
    let sale;

    before(async function () {
        [owner, user1, user2] = await ethers.getSigners();

        sale = (await deployment()).NFT;
    });

    it("should revert if updating presale is called by non-owner", async function () {
        await expect(
            sale
                .connect(user2)
                .updatePreSale(
                    _preSaleMintCost,
                    _preSaleStartTime,
                    _preSaleDuration,
                    _maxTokenPerMintPresale,
                    _limitSupplyInPreSale,
                    _publicSaleMintCost,
                    _publicSaleBufferDuration,
                    _publicSaleDuration,
                    _maxTokenPerMintPublicSale,
                    _maxTokenPerPersonPublicSale
                )
        ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should revert if new presale start time is set less than current time", async function () {
        let _newTime = (await time.latest()) - 1;
        let tx = sale
            .connect(owner)
            .updatePreSale(
                _preSaleMintCost,
                _newTime,
                _preSaleDuration,
                _maxTokenPerMintPresale,
                _limitSupplyInPreSale,
                _publicSaleMintCost,
                _publicSaleBufferDuration,
                _publicSaleDuration,
                _maxTokenPerMintPublicSale,
                _maxTokenPerPersonPublicSale
            );
        await expect(tx).to.be.revertedWith("Invalid Start Time");
    });

    it("Should correctly call updatePresale if the pre-sale is not started", async function () {
        let preSaleStartTime = (await sale.preSaleStartTime()).toNumber();

        //Increasing time to keep it near the presale start
        await time.increaseTo(preSaleStartTime - 5);

        await sale
            .connect(owner)
            .updatePreSale(
                _preSaleMintCost,
                _preSaleStartTime,
                _preSaleDuration,
                _maxTokenPerMintPresale,
                _limitSupplyInPreSale,
                _publicSaleMintCost,
                _publicSaleBufferDuration,
                _publicSaleDuration,
                _maxTokenPerMintPublicSale,
                _maxTokenPerPersonPublicSale
            );
    });

    it("Should revert after presale start if the owner tries to update PreSaleStartTime", async function () {
        let preSaleStartTime = (await sale.preSaleStartTime()).toNumber();

        //Increasing time to start the Presale
        await time.increaseTo(preSaleStartTime + 10);

        let tx = sale
            .connect(owner)
            .updatePreSale(
                _preSaleMintCost,
                preSaleStartTime + 100,
                _preSaleDuration,
                _maxTokenPerMintPresale,
                _limitSupplyInPreSale,
                _publicSaleMintCost,
                _publicSaleBufferDuration,
                _publicSaleDuration,
                _maxTokenPerMintPublicSale,
                _maxTokenPerPersonPublicSale
            );

        await expect(tx).to.be.revertedWith("Invalid Start Time");
    });

    it("Should revert if presale duration is set as zero", async function () {
        let preSaleStartTime = (await sale.preSaleStartTime()).toNumber();

        let tx = sale
            .connect(owner)
            .updatePreSale(
                _preSaleMintCost,
                preSaleStartTime,
                0,
                _maxTokenPerMintPresale,
                _limitSupplyInPreSale,
                _publicSaleMintCost,
                _publicSaleBufferDuration,
                _publicSaleDuration,
                _maxTokenPerMintPublicSale,
                _maxTokenPerPersonPublicSale
            );

        await expect(tx).to.be.revertedWith("sale duration>0");
    });

    it("should revert if public sale duration is set to zero", async function () {
        let preSaleStartTime = (await sale.preSaleStartTime()).toNumber();

        let tx = sale
            .connect(owner)
            .updatePreSale(
                _preSaleMintCost,
                preSaleStartTime,
                _preSaleDuration,
                _maxTokenPerMintPresale,
                _limitSupplyInPreSale,
                _publicSaleMintCost,
                _publicSaleBufferDuration,
                0,
                _maxTokenPerMintPublicSale,
                _maxTokenPerPersonPublicSale
            );

        await expect(tx).to.be.revertedWith("sale duration>0");
    });

    it("Presale mint cost should be greater than 100 wei", async function () {
        assert.isOk(
            await sale
                .connect(owner)
                .updatePreSale(
                    _preSaleMintCost,
                    (await sale.preSaleStartTime()).toNumber(),
                    _preSaleDuration,
                    _maxTokenPerMintPresale,
                    _limitSupplyInPreSale,
                    _publicSaleMintCost,
                    _publicSaleBufferDuration,
                    _publicSaleDuration,
                    _maxTokenPerMintPublicSale,
                    _maxTokenPerPersonPublicSale
                )
        );

        expect(await sale.preSaleMintCost()).to.greaterThan(0);
        expect(await sale.preSaleMintCost()).to.equal(500);
    });

    it("Public sale mint cost should be greater than 100 wei", async function () {
        assert.isOk(
            await sale
                .connect(owner)
                .updatePreSale(
                    _preSaleMintCost,
                    (await sale.preSaleStartTime()).toNumber(),
                    _preSaleDuration,
                    _maxTokenPerMintPresale,
                    _limitSupplyInPreSale,
                    _publicSaleMintCost,
                    _publicSaleBufferDuration,
                    _publicSaleDuration,
                    _maxTokenPerMintPublicSale,
                    _maxTokenPerPersonPublicSale
                )
        );

        expect(await sale.publicSaleMintCost()).to.greaterThan(0);

        expect(await sale.publicSaleMintCost()).to.equal(500);
    });

    it("Should revert if pre sale mint cost is less than 100 wei", async function () {
        let tx = sale
            .connect(owner)
            .updatePreSale(
                90,
                (await sale.preSaleStartTime()).toNumber(),
                _preSaleDuration,
                _maxTokenPerMintPresale,
                _limitSupplyInPreSale,
                _publicSaleMintCost,
                _publicSaleBufferDuration,
                _publicSaleDuration,
                _maxTokenPerMintPublicSale,
                _maxTokenPerPersonPublicSale
            );

        await expect(tx).to.be.revertedWith("Token cost> 100 wei");
    });

    it("Max Token per mint in presale should be greater than zero", async function () {
        assert.isOk(
            await sale
                .connect(owner)
                .updatePreSale(
                    _preSaleMintCost,
                    (await sale.preSaleStartTime()).toNumber(),
                    _preSaleDuration,
                    _maxTokenPerMintPresale,
                    _limitSupplyInPreSale,
                    _publicSaleMintCost,
                    _publicSaleBufferDuration,
                    _publicSaleDuration,
                    _maxTokenPerMintPublicSale,
                    _maxTokenPerPersonPublicSale
                )
        );

        expect(await sale.maxTokenPerMintPreSale()).to.greaterThan(0);
    });

    it("Max token per mint in public sale should be greater than zero", async function () {
        assert.isOk(
            await sale
                .connect(owner)
                .updatePreSale(
                    _preSaleMintCost,
                    (await sale.preSaleStartTime()).toNumber(),
                    _preSaleDuration,
                    _maxTokenPerMintPresale,
                    _limitSupplyInPreSale,
                    _publicSaleMintCost,
                    _publicSaleBufferDuration,
                    _publicSaleDuration,
                    _maxTokenPerMintPublicSale,
                    _maxTokenPerPersonPublicSale
                )
        );

        expect(await sale.maxTokenPerMintPublicSale()).to.greaterThan(0);
    });

    it("Max token per person in public sale should be greater than zero", async function () {
        assert.isOk(
            await sale
                .connect(owner)
                .updatePreSale(
                    _preSaleMintCost,
                    (await sale.preSaleStartTime()).toNumber(),
                    _preSaleDuration,
                    _maxTokenPerMintPresale,
                    _limitSupplyInPreSale,
                    _publicSaleMintCost,
                    _publicSaleBufferDuration,
                    _publicSaleDuration,
                    _maxTokenPerMintPublicSale,
                    _maxTokenPerPersonPublicSale
                )
        );

        expect(await sale.maxTokenPerPersonPublicSale()).to.greaterThan(0);
    });

    it("Max token per person should be greater than Max token per mint in public sale", async function () {
        assert.isOk(
            await sale
                .connect(owner)
                .updatePreSale(
                    _preSaleMintCost,
                    (await sale.preSaleStartTime()).toNumber(),
                    _preSaleDuration,
                    _maxTokenPerMintPresale,
                    _limitSupplyInPreSale,
                    _publicSaleMintCost,
                    _publicSaleBufferDuration,
                    _publicSaleDuration,
                    _maxTokenPerMintPublicSale,
                    _maxTokenPerPersonPublicSale
                )
        );

        expect(await sale.maxTokenPerPersonPublicSale()).to.greaterThanOrEqual(await sale.maxTokenPerMintPublicSale());
    });

    it("should revert if Max token per person in public sale = 1 and Max token per mint in public sale = 2", async function () {
        let tx = sale
            .connect(owner)
            .updatePreSale(
                _preSaleMintCost,
                (await sale.preSaleStartTime()).toNumber(),
                _preSaleDuration,
                _maxTokenPerMintPresale,
                _limitSupplyInPreSale,
                _publicSaleMintCost,
                _publicSaleBufferDuration,
                _publicSaleDuration,
                2,
                1
            );

        await expect(tx).to.be.revertedWith("Invalid Max Token minted per person in public sale");
    });

    it("limited supply in presale should be greater than zero", async function () {
        assert.isOk(
            await sale
                .connect(owner)
                .updatePreSale(
                    _preSaleMintCost,
                    (await sale.preSaleStartTime()).toNumber(),
                    _preSaleDuration,
                    _maxTokenPerMintPresale,
                    _limitSupplyInPreSale,
                    _publicSaleMintCost,
                    _publicSaleBufferDuration,
                    _publicSaleDuration,
                    _maxTokenPerMintPublicSale,
                    _maxTokenPerPersonPublicSale
                )
        );

        expect(await sale.limitSupplyInPreSale()).to.greaterThan(0);
    });

    it("limited supply in presale should be less than max supply", async function () {
        assert.isOk(
            await sale
                .connect(owner)
                .updatePreSale(
                    _preSaleMintCost,
                    (await sale.preSaleStartTime()).toNumber(),
                    _preSaleDuration,
                    _maxTokenPerMintPresale,
                    _limitSupplyInPreSale,
                    _publicSaleMintCost,
                    _publicSaleBufferDuration,
                    _publicSaleDuration,
                    _maxTokenPerMintPublicSale,
                    _maxTokenPerPersonPublicSale
                )
        );

        expect(await sale.limitSupplyInPreSale()).to.lessThanOrEqual(await sale.maxSupply());
    });

    it("Should revert if limited supply in presale is set as 2000 (i.e., greater than max supply)", async function () {
        let tx = sale
            .connect(owner)
            .updatePreSale(
                _preSaleMintCost,
                (await sale.preSaleStartTime()).toNumber(),
                _preSaleDuration,
                _maxTokenPerMintPresale,
                2000,
                _publicSaleMintCost,
                _publicSaleBufferDuration,
                _publicSaleDuration,
                _maxTokenPerMintPublicSale,
                _maxTokenPerPersonPublicSale
            );

        await expect(tx).to.be.revertedWith("incorrect presale limit supply");
    });
});

describe("Testing Update PublicSale...", function () {
    let saleContract;

    before(async function () {
        saleContract = (await deployment()).NFT;
        [owner, user1, user2] = await ethers.getSigners();
    });

    it("Should revert if updating public sale is called by non-owner", async function () {
        let tx = saleContract
            .connect(user2)
            .updatePublicSale(
                _publicSaleMintCost,
                _publicSaleBufferDuration,
                _publicSaleDuration,
                _maxTokenPerMintPublicSale,
                _maxTokenPerPersonPublicSale
            );

        await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should revert if public sale start time is set prior to the current time", async function () {
        const preSaleEndTime = (await saleContract.preSaleEndTime()).toNumber();

        //set in contract
        const defaultPublicSaleBufferDuration = 30;

        //increasing time till presaleEndTime + defaultBuffer Duration

        await time.increaseTo(preSaleEndTime + defaultPublicSaleBufferDuration);

        //Setting PublicSale Buffer Duration as 0
        let tx = saleContract
            .connect(owner)
            .updatePublicSale(
                _publicSaleMintCost,
                0,
                _publicSaleDuration,
                _maxTokenPerMintPublicSale,
                _maxTokenPerPersonPublicSale
            );

        await expect(tx).to.be.revertedWith("Invalid Start Time");
        let _publicSaleStartTime = (await saleContract.publicSaleStartTime()).toNumber();

        expect(_publicSaleStartTime).to.greaterThan(await time.latest());
    });

    it("Should correctly call update Public Sale if the public sale is not started", async function () {
        let _publicSaleStartTime = (await saleContract.publicSaleStartTime()).toNumber();

        //Increasing time to keep it near the publicSale start
        await time.increaseTo(_publicSaleStartTime - 5);

        assert.isOk(
            await saleContract
                .connect(owner)
                .updatePublicSale(
                    _publicSaleMintCost,
                    _publicSaleBufferDuration,
                    _publicSaleDuration,
                    _maxTokenPerMintPublicSale,
                    _maxTokenPerPersonPublicSale
                )
        );
    });

    it("should revert if public sale duration is set as zero", async function () {
        let tx = saleContract
            .connect(owner)
            .updatePublicSale(
                _publicSaleMintCost,
                _publicSaleBufferDuration,
                0,
                _maxTokenPerMintPublicSale,
                _maxTokenPerPersonPublicSale
            );

        await expect(tx).to.be.revertedWith("Public sale duration > 0");
    });

    it("Public sale mint cost should be greater than 100 wei", async function () {
        assert.isOk(
            await saleContract
                .connect(owner)
                .updatePublicSale(
                    _publicSaleMintCost,
                    _publicSaleBufferDuration,
                    _publicSaleDuration,
                    _maxTokenPerMintPublicSale,
                    _maxTokenPerPersonPublicSale
                )
        );

        expect(await saleContract.publicSaleMintCost()).to.greaterThan(0);
        expect(await saleContract.publicSaleMintCost()).to.equal(500);
    });

    it("Should revert if public sale mint cost is less than 100 wei", async function () {
        let tx = saleContract
            .connect(owner)
            .updatePublicSale(
                90,
                _publicSaleBufferDuration,
                _publicSaleDuration,
                _maxTokenPerMintPublicSale,
                _maxTokenPerPersonPublicSale
            );

        await expect(tx).to.be.revertedWith("Invalid Token cost");
    });

    it("Max token per mint in public sale should be greater than zero", async function () {
        assert.isOk(
            await saleContract
                .connect(owner)
                .updatePublicSale(
                    _publicSaleMintCost,
                    _publicSaleBufferDuration,
                    _publicSaleDuration,
                    _maxTokenPerMintPublicSale,
                    _maxTokenPerPersonPublicSale
                )
        );

        expect(await saleContract.maxTokenPerMintPublicSale()).to.greaterThan(0);
    });

    it("Max token per person in public sale should be greater than zero", async function () {
        assert.isOk(
            await saleContract
                .connect(owner)
                .updatePublicSale(
                    _publicSaleMintCost,
                    _publicSaleBufferDuration,
                    _publicSaleDuration,
                    _maxTokenPerMintPublicSale,
                    _maxTokenPerPersonPublicSale
                )
        );

        expect(await saleContract.maxTokenPerPersonPublicSale()).to.greaterThan(0);
    });

    it("Max token per person should be greater than Max token per mint in public sale", async function () {
        assert.isOk(
            await saleContract
                .connect(owner)
                .updatePublicSale(
                    _publicSaleMintCost,
                    _publicSaleBufferDuration,
                    _publicSaleDuration,
                    _maxTokenPerMintPublicSale,
                    _maxTokenPerPersonPublicSale
                )
        );

        expect(await saleContract.maxTokenPerPersonPublicSale()).to.greaterThanOrEqual(
            await saleContract.maxTokenPerMintPublicSale()
        );
    });

    it("should revert update signer function if it's not called by non-owner", async function () {
        let tx = saleContract.connect(user1).updateSignerAddress(user2.address);

        await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should revert update signer function if the new signer is zero address", async function () {
        const ZERO = "0x0000000000000000000000000000000000000000";

        let tx = saleContract.connect(owner).updateSignerAddress(ZERO);

        await expect(tx).to.be.revertedWith("Invalid Signer");
    });

    it("should revert if update version function is called by non-owner", async function () {
        let tx = saleContract.connect(user1).setVersion(2);

        await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("successfully update version function is called by non-owner", async function () {
        assert.isOk(await saleContract.connect(owner).setVersion(2));

        const _version = await saleContract.version();

        expect(_version).to.be.equal(2);
    });
});
