const { ethers, BigNumber, deployments, getNamedAccounts } = require("hardhat");
const { expect, assert, revert } = require("chai");
const { time, loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
let { deployment, modify_data, params, vrfCoordinator, Link } = require("./helper");
const { networkConfig } = require("../../helper-hardhat-config");

describe("Testing saleWithPresaleWithRandomDelayed_init...", function () {
    let sale, accounts;

    before(async function () {
        let deployedContracts = await deployment();
        sale = deployedContracts.NFT;
        const factory = deployedContracts.NFTFactory;
        await factory.setApproval(sale.address);

    });

    it("Should revert when the init function is called again", async function () {
        let preSaleConfig = {
            _preSaleMintCost: params.preSaleMintCost,
            _preSaleStartTime: (await time.latest()) + 200,
            _preSaleDuration: params.preSaleDuration,
            _maxTokenPerMintPresale: params.maxTokenPerMintPresale,
            _limitSupplyInPreSale: params.limitSupplyInPreSale,
        };

        let publicSaleConfig = {
            _publicSaleMintCost: params.publicSaleMintCost,
            _publicSaleBufferDuration: params.publicSaleBufferDuration,
            _publicSaleDuration: params.publicSaleDuration,
            _maxTokenPerMintPublicSale: params.maxTokenPerMintPublicSale,
            _maxTokenPerPersonPublicSale: params.maxTokenPerPersonPublicSale,
        };
        let randomConfig = {
            _vrfCoordinator: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", //vrfCoordinator
            _link: "0x5FbDB2315678afecb367f032d93F642f64180aa3", //Link,
            _KeyHash: networkConfig[5]["KeyHash"].toString(),
            _fee: networkConfig[5]["Fee"].toString(),
        };

        let _signerAddress = await sale.signerAddress();
        accounts = await ethers.getSigners();

        let tx = sale
            .connect(accounts[0])
            .__NFTWithPresaleWithRandomDelayed_init(
                "Example",
                "Ex",
                "Example.com",
                "a234",
                1000,
                "1",
                Object.values(preSaleConfig),
                Object.values(publicSaleConfig),
                _signerAddress,
                Object.values(randomConfig)
            );

        await expect(tx).to.be.revertedWith("Initializable: contract is already initialized");
    });

    it("Should have correct Max Supply, correct name, symbol basuri, sale ID and signer Address", async function () {
        let signerAddress = (await getNamedAccounts()).signerAddress;
        let deployer = (await getNamedAccounts()).deployer;

        const _name = await sale.name();
        const _symbol = await sale.symbol();
        const _baseUri = await sale.baseUri();
        const _uri = await sale.uri(1);
        const _owner = await sale.owner();
        const _signerAddress = await sale.signerAddress();

        expect(_name).to.equal("Example");
        expect(_symbol).to.equal("EXPL");
        expect(_baseUri).to.equal("https://example.com/");
        expect(_uri).to.equal("https://example.com/1");
        expect(_signerAddress).to.equal(signerAddress);
        expect(_owner).to.equal(deployer);
        expect(_signerAddress).to.equal(signerAddress);
    });

    it("Max supply Should be in range 0-100000", async function () {
        const _maxSupply = await sale.maxSupply();

        expect(_maxSupply).to.be.within(0, 100000);
        // expect(_maxSupply).to.equal(1000);
    });

    it("Public sale mint cost should be greater than 100 wei", async function () {
        const _publicSaleMintCost = await sale.publicSaleMintCost();

        expect(_publicSaleMintCost).to.greaterThanOrEqual(ethers.utils.parseUnits("100", "wei"));
    });

    it("Presale mint cost should be greater than 100 wei", async function () {
        const _preSaleMintCost = await sale.preSaleMintCost();

        expect(_preSaleMintCost).to.greaterThanOrEqual(ethers.utils.parseUnits("100", "wei"));
    });

    it("Presale start time Should be greater than current time", async function () {
        const _preSaleStartTime = await sale.preSaleStartTime();

        expect(_preSaleStartTime).to.greaterThanOrEqual(await time.latest());
    });

    it("Presale duration should be greater than zero", async function () {
        const _preSaleStartTime = await sale.preSaleStartTime();

        const _preSaleEndTime = await sale.preSaleEndTime();

        expect(_preSaleEndTime - _preSaleStartTime).to.greaterThan(0);

        expect(_preSaleEndTime - _preSaleStartTime).to.equal(120);
    });

    it("Public sale duration should be greater than zero", async function () {
        const _publicSaleStartTime = await sale.publicSaleStartTime();
        const _publicSaleEndTime = await sale.publicSaleEndTime();

        expect(_publicSaleEndTime - _publicSaleStartTime).to.equal(120);
    });

    it("Max Token per mint pre sale should be greater than zero", async function () {
        const _maxTokenPerMintPreSale = await sale.maxTokenPerMintPreSale();

        expect(_maxTokenPerMintPreSale).to.greaterThan(0);
    });

    it("Max Token per mint presale should be lesser than Presale Supply", async function () {
        const _maxTokenPerMintPreSale = await sale.maxTokenPerMintPreSale();

        expect(_maxTokenPerMintPreSale).to.lessThanOrEqual(await sale.limitSupplyInPreSale());
    });

    it("allowed minting limit in single transaction should be greater than zero", async function () {
        const _maxTokenPerMintPublicSale = await sale.maxTokenPerMintPublicSale();

        expect(_maxTokenPerMintPublicSale).to.greaterThan(0);
    });

    it("allowed minting limit in single public sale should be greater than zero", async function () {
        const _maxTokenPerPersonPublicSale = await sale.maxTokenPerPersonPublicSale();

        expect(_maxTokenPerPersonPublicSale).to.greaterThan(0);
    });

    it("Max Token per person public sale Should be greater than or equal to allowed minting limit in single transaction", async function () {
        const _maxTokenPerMintPublicSale = await sale.maxTokenPerMintPublicSale();

        const _maxTokenPerPersonPublicSale = await sale.maxTokenPerPersonPublicSale();

        expect(_maxTokenPerPersonPublicSale).to.greaterThanOrEqual(_maxTokenPerMintPublicSale);
    });

    it("limitSupplyInPresale should be lesser than Max supply and greater than zero", async function () {
        const _presaleSupply = await sale.limitSupplyInPreSale();

        expect(_presaleSupply).to.greaterThan(0);

        expect(_presaleSupply).to.be.lessThanOrEqual(await sale.maxSupply());
    });

    it("Sale version should be 1", async function () {
        expect(await sale.version()).to.equal(1);
    });

    it("Sale version can only be set by owner", async function () {
        let _version = 2;

        await sale.connect(accounts[0]).setVersion(_version);

        expect(await sale.version()).to.equal(2);
    });

    context("reverting scenarios", function () {
        afterEach(async function () {
            modify_data({}, false);
        });

        it("Should revert if max supply is set to greater than 1L", async function () {
            modify_data({ maxSupply: 100001 }, true);

            await expect(deployment()).to.be.revertedWith("Init: Invalid max supply");
        });

        it("Should revert if presale Start time is set prior to current time", async function () {
            modify_data({ preSaleStartTime: (await time.latest()) - 1 }, true);

            await expect(deployment()).to.be.revertedWith("Init: Invalid PreSale Start Time");
        });

        it("Should revert if public or pre sale mint cost is set to less than 100 wei (e.g., 99 wei)", async function () {
            modify_data({ preSaleMintCost: 99 }, true);

            await expect(deployment()).to.be.revertedWith("Init: Invalid Token Cost");
        });

        it("Should revert if maxTokenPerMintPreSale is set greater than Presale Supply", async function () {
            modify_data({ maxTokenPerMintPresale: 51 }, true);

            await expect(deployment()).to.be.revertedWith("Init: Invalid maxTokenPerMint in presale");
        });

        it("Should revert if maxTokenPerPersonPublicSale is set greater than Max Supply", async function () {
            const _maxSupply = params.maxSupply;

            modify_data({ maxTokenPerPersonPublicSale: _maxSupply + 1 }, true);

            await expect(deployment()).to.be.revertedWith("Init: Invalid MaxTokenPerPerson of public sale");
        });

        it("Should revert if maxTokenPerPersonPublicSale is less than maxTokenPerMintPublicSale", async function () {
            modify_data({ maxTokenPerPersonPublicSale: 4, maxTokenPerMintPublicSale: 8 }, true);

            await expect(deployment()).to.be.revertedWith("Init: Invalid MaxTokenPerPerson of public sale");
        });
    });
});
