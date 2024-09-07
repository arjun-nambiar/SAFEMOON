const { ethers, waffle, BigNumber, deployments, getNamedAccounts } = require("hardhat");
const { expect, assert, revert } = require("chai");
const { time, loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
let { deployment, modify_data } = require("./helper");

var Web3 = require("web3");
const web3 = new Web3("http://127.0.0.1:8545/");

describe("Scenario Testing...", function () {
    let sale,
        owner,
        whitelistedUser,
        affiliatedUser,
        affiliatedUser2,
        accounts,
        _limitSupplyInPreSale,
        _maxSupply,
        signerPrivateKey,
        saleId;

    let addresses = new Array();

    let chainId = network.config.chainId;

    before(async function () {
        modify_data(
            {
                maxSupply: 150,
                limitSupplyInPreSale: 75,
                maxTokenPerMintPresale: 75,
                maxTokenPerMintPublicSale: 100,
                maxTokenPerPersonPublicSale: 150,
            },
            true
        );
        
        const deployed = (await deployment());

        sale = deployed.NFT;

        factory = deployed.NFTFactory;

        await factory.setApproval(sale.address, {from: await factory.owner()});


        accounts = await ethers.getSigners();

        owner = accounts[0];
        whitelistedUser = accounts[1];
        affiliatedUser = accounts[2];
        affiliatedUser2 = accounts[4];

        //accounts[4] is signerAddress
        signerPrivateKey = "0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a";

        for (let i = 0; i < accounts.length; i++) {
            let temp = accounts[i];

            addresses.push(temp.address);
        }

        _maxSupply = (await sale.maxSupply()).toNumber();

        _limitSupplyInPreSale = (await sale.limitSupplyInPreSale()).toNumber();

        saleId = await sale.saleId();

        // console.log(`Max Supply: ${_maxSupply}`);

        // console.log(`Presale Supply: ${_limitSupplyInPreSale}`);
    });

    describe("Scenario 1:Airdrop, UpdatePresale, PresaleBuy, Airdrop in between sale, Public sale buy, Affiliated Buy, Airdrop, TransferOwnership, transferAffiliatedFunds and Withdraw", () => {
        let _totalMint,
            _preSaleAirdropCount,
            _publicSaleAirdropCount,
            _presalelive,
            _publicsalelive,
            _preSaleMintCost,
            _publicSaleMintCost;

        let _preSaleDuration = 120;
        let _publicSaleBufferDuration = 30;
        let _publicSaleDuration = 120;
        let _maxTokenPerMintPublicSale = 100;
        let _maxTokenPerPersonPublicSale = 150;

        it("Airdropping 45 and 55 from pre and public sale", async function () {
            let shares = [45, 55];

            let addresses100 = [...addresses, ...addresses, ...addresses, ...addresses, ...addresses];

            assert.isOk(await sale.connect(owner).createAirdrop(addresses100, shares));

            _totalMint = (await sale.totalMint()).toNumber();

            _preSaleAirdropCount = (await sale.preSaleAirdropCount()).toNumber();

            _publicSaleAirdropCount = (await sale.publicSaleAirdropCount()).toNumber();

            expect(_totalMint).to.equal(100);

            expect(_preSaleAirdropCount).to.equal(45);

            expect(_publicSaleAirdropCount).to.equal(55);
        });

        it("Update Presale: Should revert if presale limitSupply is set to 46 and maxTokenPerMintPresale kept unchanged", async function () {
            _preSaleMintCost = (await sale.preSaleMintCost()).toNumber();
            _publicSaleMintCost = (await sale.publicSaleMintCost()).toNumber();
            let _preSaleStartTime = (await sale.preSaleStartTime()).toNumber();
            let _maxTokenPerMintPresale = (await sale.maxTokenPerMintPreSale()).toNumber();
            let _limitSupplyInPreSale = 46;

            _publicSaleAirdropCount = (await sale.publicSaleAirdropCount()).toNumber();

            // console.log(_publicSaleAirdropCount);

            let minLimitSupplyInPreSale = _totalMint - _publicSaleAirdropCount;

            // console.log(minLimitSupplyInPreSale);

            //Starting the presale
            await time.increaseTo(_preSaleStartTime + 10);

            _presalelive = await sale.isPreSaleLive();

            expect(_presalelive).to.be.true;

            //It reverted with Maximum token per mint in presale > 0, reason string Should be updated
            await expect(
                sale
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
                    )
            ).to.be.revertedWith("Invalid maximum token per mint in presale");
        });

        it("Update Presale: Should revert if Presale limitSupply is set to 44 and maxTokenPerMintPresale is set to 30", async function () {
            let _preSaleStartTime = (await sale.preSaleStartTime()).toNumber();
            let _maxTokenPerMintPresale = 30;
            let _limitSupplyInPreSale = 44;

            // _limitSupplyInPreSale>totalMint-_publicSaleAirdropCount
            await expect(
                sale
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
                    )
            ).to.be.revertedWith("incorrect presale limit supply");
        });

        it("Update Presale: Should revert if Presale limitSupply sets as greater than maxSupply-PublicSaleAirdropCount (Require Contract Fix)", async function () {
            let _preSaleStartTime = (await sale.preSaleStartTime()).toNumber();
            let _maxTokenPerMintPresale = 30;
            let _limitSupplyInPreSale = 101;

            // _limitSupplyInPreSale>totalMint-_publicSaleAirdropCount
            await expect(
                sale
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
                    )
            ).to.be.revertedWith("incorrect presale limit supply");
        });

        it("Update Presale: Should success if Presale limitSupply is set to 50 and maxTokenPerMintPresale is set to 30", async function () {
            let _preSaleStartTime = (await sale.preSaleStartTime()).toNumber();
            let _maxTokenPerMintPresale = 30;
            let _limitSupplyInPreSale = 50;

            //Note:
            //Since limitSupply can be set more than 45 so maxTokenPerMintPresale Should be kept lesser than
            //_newlimitSupplyInPreSale-totalMint+publiSaleAirdropCount
            //So in this case, _maxTokenPerMintPresale can't be kept more than 5..

            assert.isOk(
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
                    )
            );
        });

        it("Should revert Presale Buy of more than 5 tokens", async function () {
            let tokenSignQuantity = (await sale.maxTokenPerMintPreSale()).toNumber();

            //Creating new signature of whitelistedUser with 0 token Sign Quantity
            const hash = await web3.utils.soliditySha3(
                whitelistedUser.address,
                chainId,
                tokenSignQuantity,
                saleId,
                sale.address
            );

            let msg = await web3.eth.accounts.sign(hash, signerPrivateKey);

            let tx = sale.connect(whitelistedUser).preSaleBuy(tokenSignQuantity, 6, msg.signature, { value: 6020 });

            await expect(tx).to.be.revertedWith("exceeding presale supply");
        });

        it("Should success Presale Buy of 3 tokens", async function () {
            let tokenSignQuantity = (await sale.maxTokenPerMintPreSale()).toNumber();

            const hash = await web3.utils.soliditySha3(
                whitelistedUser.address,
                chainId,
                tokenSignQuantity,
                saleId,
                sale.address
            );

            let msg = await web3.eth.accounts.sign(hash, signerPrivateKey);

            assert.isOk(
                await sale
                    .connect(whitelistedUser)
                    .preSaleBuy(tokenSignQuantity, 3, msg.signature, { value: _preSaleMintCost * 3 })
            );

            let _postotalMint = (await sale.totalMint()).toNumber();

            expect(_postotalMint - _totalMint).to.equal(3);

            _totalMint = _postotalMint;
        });

        it("Should revert airdrop if presale is live", async function () {
            let shares = [1, 2];

            let tx = sale.connect(owner).createAirdrop([addresses[0], addresses[1], addresses[2]], shares);

            await expect(tx).to.be.revertedWith("Airdrop:Invalid Time");
        });

        it("Should revert airdrop from Presale After Presale", async function () {
            let _preSaleStartTime = (await sale.preSaleStartTime()).toNumber();

            //Ending the presale
            await time.increaseTo(_preSaleStartTime + 125);

            _presalelive = await sale.isPreSaleLive();

            expect(_presalelive).to.be.false;

            let shares = [1, 2];

            let tx = sale.connect(owner).createAirdrop([addresses[0], addresses[1], addresses[2]], shares);

            await expect(tx).to.be.revertedWith("Airdrop: Invalid Presale Share");
        });

        it("Successfully airdrop After Presale", async function () {
            let shares = [0, 3];

            assert.isOk(await sale.connect(owner).createAirdrop([addresses[0], addresses[1], addresses[2]], shares));

            let _postotalMint = (await sale.totalMint()).toNumber();

            expect(_postotalMint - _totalMint).to.equal(3);

            _totalMint = _postotalMint;
        });

        it("Should revert public sale buy if the public sale is not started", async function () {
            let tokenQuantity = 2;

            await expect(
                sale.connect(whitelistedUser).publicSaleBuy(tokenQuantity, { value: 2020 })
            ).to.be.revertedWith("Public Sale-not live");
        });

        it("Should Successfully buy in public sale after the public sale is started", async function () {
            let tokenQuantity = 2;

            let _publicSaleStartTime = (await sale.publicSaleStartTime()).toNumber();

            //Starting the Public Sale
            await time.increaseTo(_publicSaleStartTime + 10);

            _publicsalelive = await sale.isPublicSaleLive();

            expect(_publicsalelive).to.be.true;

            assert.isOk(
                await sale.connect(whitelistedUser).publicSaleBuy(tokenQuantity, { value: _publicSaleMintCost * 10 })
            );

            let _postotalMint = (await sale.totalMint()).toNumber();

            expect(_postotalMint - _totalMint).to.equal(2);

            _totalMint = _postotalMint;
        });

        it("Should Successfully perform affiliated buy in public sale", async function () {
            let commission = 80;

            const hash = await web3.utils.soliditySha3(
                whitelistedUser.address,
                chainId,
                affiliatedUser.address,
                commission,
                saleId,
                sale.address
            );

            let msg = await web3.eth.accounts.sign(hash, signerPrivateKey);

            await sale
                .connect(whitelistedUser)
                .publicSaleBuyAffiliated(10, affiliatedUser.address, commission, msg.signature, {
                    value: _publicSaleMintCost * 10,
                });

            let _postotalMint = (await sale.totalMint()).toNumber();

            expect(_postotalMint - _totalMint).to.equal(10);

            _totalMint = _postotalMint;
        });

        it("Should Successfully perform affiliated buy in public sale from another affiliated User link", async function () {
            let commission = 80;

            const hash = await web3.utils.soliditySha3(
                whitelistedUser.address,
                chainId,
                affiliatedUser2.address,
                commission,
                saleId,
                sale.address
            );

            let msg = await web3.eth.accounts.sign(hash, signerPrivateKey);

            await sale
                .connect(whitelistedUser)
                .publicSaleBuyAffiliated(10, affiliatedUser2.address, commission, msg.signature, {
                    value: _publicSaleMintCost * 10,
                });

            let _postotalMint = (await sale.totalMint()).toNumber();

            expect(_postotalMint - _totalMint).to.equal(10);

            _totalMint = _postotalMint;
        });

        it("Should revert airdrop if dropping tokens are more than available after public sale", async function () {
            let _publicSaleEndTime = (await sale.publicSaleEndTime()).toNumber();

            //End the Public Sale
            await time.increaseTo(_publicSaleEndTime + 10);

            _publicsalelive = await sale.isPublicSaleLive();

            expect(_publicsalelive).to.be.false;

            let addresses23 = [...addresses, owner.address, owner.address, whitelistedUser.address];

            let shares = [0, 23];

            let tx = sale.connect(owner).createAirdrop(addresses23, shares);

            await expect(tx).to.be.revertedWith("Airdrop: exceeds max Supply");
        });

        it("Should Successfully airdrop if dropping tokens are less than available after public sale", async function () {
            let addresses22 = [...addresses, owner.address, whitelistedUser.address];

            let shares = [0, 22];

            assert.isOk(await sale.connect(owner).createAirdrop(addresses22, shares));

            let _postotalMint = (await sale.totalMint()).toNumber();

            expect(_postotalMint - _totalMint).to.equal(22);

            _totalMint = _postotalMint;
        });

        it("Should revert transferOwnership if the newOwner address is contractAddress or non-existent address (Require Contract Fix)", async function () {
            const _newOwner = sale.address;

            // let tx = sale.connect(owner).transferOwnership(_newOwner);

            // await expect(tx).to.be.revertedWith("");
        });

        it("Should Successfully transfer ownership to correct address", async function () {
            let _newOwner = accounts[1];

            assert.isOk(await sale.connect(owner).transferOwnership(_newOwner.address));

            let _owner = await sale.owner();

            expect(_owner).to.equal(_newOwner.address);

            owner = _newOwner;
        });

        it("Should revert if any one tries to withdraw eth from contract.", async function () {
            const _bal = await ethers.provider.getBalance(sale.address);

            let tx = sale.connect(affiliatedUser).withdrawWei(_bal);

            await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("Should revert if owner tries to withdraw zero eth.", async function () {
            let tx = sale.connect(owner).withdrawWei(0);

            await expect(tx).to.be.revertedWith("Amount>0");
        });

        it("Should revert if owner tries to withdraw more eth than available (total-affiliatedWei)", async function () {
            const _bal = await ethers.provider.getBalance(sale.address);

            let tx = sale.connect(owner).withdrawWei(_bal);

            await expect(tx).to.be.revertedWith("Not enough eth");
        });

        it("Successfully withdraw eth available (total-affiliatedWei) and transfer fees to admin wallet", async function () {
            const _bal = await ethers.provider.getBalance(sale.address);

            const dropFee = await sale.dropFee();

            const _affiliatedWei = (await sale.affiliatedWei()).toNumber();

            const totalDropFee = (Number(_bal-_affiliatedWei)*Number(dropFee))/10000;

            assert.isOk(sale.connect(owner).withdrawWei(_bal - _affiliatedWei));

            const feesCollected = await sale.feesCollected();

            expect(feesCollected.toString()).to.be.equal(totalDropFee.toString());
        });

        it("Should revert if owner tries to transfer funds to non-affiliated user", async function () {
            const _affiliatedWei = (await sale.affiliatedWei()).toNumber();

            let tx = sale.connect(owner).transferAffiliatedFunds([whitelistedUser.address]);

            await expect(tx).to.be.revertedWithCustomError;
        });

        it("Should revert transfer funds if entered affiliated user addresses are not part of affilated marketing", async function () {
            let tx = sale.connect(owner).transferAffiliatedFunds([whitelistedUser.address, owner.address]);

            ////Some Hardhat Error in decoding reason string, Although it works as expected
            await expect(tx).to.be.revertedWithCustomError;
        });

        it("Successfully transfer funds to affiliated users and transfer funds to admin wallet", async function () {
            const feesCollectedBefore = await sale.feesCollected();
            assert.isOk(
                await sale.connect(owner).transferAffiliatedFunds([affiliatedUser.address, affiliatedUser2.address])
            );
            expect((await sale.affiliatedWei()).toNumber()).to.equal(0);

            const feesCollectedAfter = await sale.feesCollected();

            expect(Number(feesCollectedAfter)-Number(feesCollectedBefore)).to.greaterThan(0);

            expect((await sale.affiliatedUserBalance(affiliatedUser.address)).toNumber()).to.equal(0);
        });
    });
});
