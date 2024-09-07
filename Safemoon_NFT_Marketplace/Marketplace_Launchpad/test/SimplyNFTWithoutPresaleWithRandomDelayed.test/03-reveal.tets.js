const { ethers, BigNumber, deployments, getNamedAccounts, network } = require("hardhat");
const { expect, assert, revert } = require("chai");
const { time, loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
let { deployment, modify_data, params, vrfCoordinator } = require("./helper");

let owner, user1, user2;

describe("Testing Random number Generation and Perform Reveal after Public Sale...", function () {
    let sale, link, vrfCoordinatorMock;

    before(async function () {
        [owner, user1, user2] = await ethers.getSigners();

        sale = (await deployment()).NFTWithoutPresale;

        let linkTokenAddress = await sale.getLinkAddress();

        let vrfCoordinatorAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512" || vrfCoordinator;

        vrfCoordinatorMock = await ethers.getContractAt("VRFCoordinatorMock", vrfCoordinatorAddress);

        link = await ethers.getContractAt("LinkToken", linkTokenAddress);
    });

    it("Should revert if public sale is not ended", async function () {
        let _publicSaleStartTime = (await sale.publicSaleStartTime()).toNumber();

        //Starting the Public Sale
        await time.increaseTo(_publicSaleStartTime + 10);

        let tx = sale.connect(owner).requestRandomNumber();

        await expect(tx).to.be.revertedWith("Public sale is not yet ended");
    });

    it("Should reverts when non-owner calls.", async function () {
        let _publicSaleEndTime = (await sale.publicSaleEndTime()).toNumber();

        //Ending the Public Sale
        await time.increaseTo(_publicSaleEndTime + 10);

        let publicSaleStatus = await sale.isPublicSaleLive();

        expect(publicSaleStatus).to.be.false;

        let tx = sale.connect(user1).requestRandomNumber();

        await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should revert without Link Token Balance", async function () {
        let tx = sale.connect(owner).requestRandomNumber();

        await expect(tx).to.be.revertedWith("LINK Balance>fee");
    });

    it("Should revert revealTokensURI if random number is not generated", async function () {
        let _uri = "NFTExample.com";

        let tx = sale.connect(owner).revealTokens(_uri);

        await expect(tx).to.be.revertedWith("random number to be assigned");
    });

    it("Should revert getAssetId before reveal", async function () {
        let tx = sale.connect(owner).getAssetId(1);

        await expect(tx).to.be.revertedWith("reveal the token first");
    });

    it("Should sucessfully call request random number", async function () {
        //Transferring 2 LinkTokens to contract
        await link.connect(owner).transfer(sale.address, ethers.utils.parseUnits("2", 18));

        let vrfRequestId;

        [vrfRequestId] = await sale.connect(owner).callStatic.requestRandomNumber();

        // const txReceipt = await txResponse.wait(1);

        await vrfCoordinatorMock
            .connect(owner)
            .callBackWithRandomness(
                vrfRequestId,
                "23338163512212949604391873626263890770407127945744127666325235206775937213334",
                sale.address
            );

        const randomNumber = await sale.connect(owner).getRandomNumber();

        expect(randomNumber.toString()).to.equal(
            "23338163512212949604391873626263890770407127945744127666325235206775937213334"
        );
    });

    it("Should revert if request random number is called again", async function () {
        let tx = sale.connect(owner).callStatic.requestRandomNumber();

        await expect(tx).to.be.revertedWith("Already obtained random number");
    });

    it("Should revert revealTokensURI if it's not called by an owner", async function () {
        let _uri = "NFTExample.com";

        let tx = sale.connect(user1).revealTokens(_uri);

        await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should sucessfully reveal after generating random number", async function () {
        let _uri = "NFTExample.com";

        let tx = sale.connect(owner).revealTokens(_uri);

        await expect(tx)
            .to.emit(sale, "TokensRevealed")
            .withArgs((await time.latest()) + 1);

        // await expect(tx).to.emit(sale, "URI")
        //     .withArgs(_uri);

        let _revealed = await sale.revealed();

        expect(_revealed).to.be.true;
    });

    it("Should revert if the reveal function is called again", async function () {
        let _revealed = await sale.revealed();
        expect(_revealed).to.be.true;
        let tx = sale.connect(owner).revealTokens("test.com");

        await expect(tx).to.be.revertedWith("Already revealed");
    });

    it("Should sucessfully generate random asset Ids after reveal without any collision", async function () {
        const _totalMint = (await sale.totalMint()).toNumber();

        const assetIdList = [];

        for (let index = 1; index <= _totalMint; index++) {
            const assetId = (await sale.getAssetId(index)).toNumber();

            assetIdList.push(assetId.toString());
        }

        const uniqueCollection = new Set(assetIdList);

        let isAllElementUnique = assetIdList.length === uniqueCollection.size;

        expect(isAllElementUnique).to.equal(true);

        let allIdsAvailable = true;

        for (let index = 1; index <= _totalMint; index++) {
            if (!assetIdList.includes(index.toString())) {
                allIdsAvailable = false;
            }
        }
        expect(allIdsAvailable).to.equal(true);
    });

    it("Should revert if random asset id of invalid token Id is requested", async function () {
        const _totalMint = (await sale.totalMint()).toNumber();

        let tx = sale.getAssetId(_totalMint + 1);

        await expect(tx).to.be.revertedWith("Invalid token Id");
    });

    it("Withdraw Link: Should revert if non-owner tries to withdraw link", async function () {
        const _amount = ethers.utils.parseUnits("1", 18);

        let tx = sale.connect(user1).withdrawLink(_amount);

        await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Withdraw Link: Should successfully withdraw link by owner", async function () {
        const _linkBalanceBefore = await link.balanceOf(sale.address);

        assert.isOk(await sale.connect(owner).withdrawLink(_linkBalanceBefore));

        const _linkBalanceAfter = await link.balanceOf(sale.address);

        expect(_linkBalanceAfter.toString()).to.equal("0");
    });
});
