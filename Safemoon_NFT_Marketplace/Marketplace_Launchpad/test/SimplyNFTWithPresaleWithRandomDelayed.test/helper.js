const { ethers, BigNumber, deployments, getNamedAccounts, network } = require("hardhat");
const { time, loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

const name = "Example";
const symbol = "EXPL";
const baseUri = "https://example.com/";

//Default sale parameters of a shop
var params = {
    maxSupply: 1000,
    preSaleMintCost: 1000,
    publicSaleMintCost: 1000,
    preSaleStartTime: setTime(),
    preSaleDuration: 120,
    publicSaleBufferDuration: 30,
    publicSaleDuration: 120,
    maxTokenPerMintPresale: 3,
    maxTokenPerMintPublicSale: 100,
    maxTokenPerPersonPublicSale: 100,
    limitSupplyInPreSale: 50,
};

async function setTime() {
    return (await time.latest()) + 200;
}

//initializing with default sale paramters
let maxSupply = params.maxSupply;
let preSaleMintCost = params.preSaleMintCost;
let publicSaleMintCost = params.publicSaleMintCost;
let preSaleStartTime = params.preSaleStartTime;
let preSaleDuration = params.preSaleDuration;
let publicSaleBufferDuration = params.publicSaleBufferDuration;
let publicSaleDuration = params.publicSaleDuration;
let maxTokenPerMintPresale = params.maxTokenPerMintPresale;
let maxTokenPerMintPublicSale = params.maxTokenPerMintPublicSale;
let maxTokenPerPersonPublicSale = params.maxTokenPerPersonPublicSale;
let limitSupplyInPreSale = params.limitSupplyInPreSale;
let deployer;
let signerAddress;
let shopCreator;

let preSaleConfig, publicSaleConfig;

let NFTFactory, NFT, vrfCoordinator, Link;

async function deployment() {
    let accounts = await ethers.getSigners();

    signerAddress = (await getNamedAccounts()).signerAddress;

    shopCreator = (await getNamedAccounts()).creator;

    await deployments.fixture(["all"]);

    NFTFactory = await ethers.getContract("NFTFactory", deployer);

    const vrfCoordinatorMock = await ethers.getContract("VRFCoordinatorMock", deployer);

    vrfCoordinator = vrfCoordinatorMock.address;

    const link = await ethers.getContract("LinkToken", deployer);

    Link = link.address;

    // console.log(`NFTFactory Contract Address: ${NFTFactory.address}`);

    // await expect(NFTFactory.version).to.equal("1");

    preSaleConfig = {
        _preSaleMintCost: preSaleMintCost,
        _preSaleStartTime: preSaleStartTime,
        _preSaleDuration: preSaleDuration,
        _maxTokenPerMintPresale: maxTokenPerMintPresale,
        _limitSupplyInPreSale: limitSupplyInPreSale,
    };

    publicSaleConfig = {
        _publicSaleMintCost: publicSaleMintCost,
        _publicSaleBufferDuration: publicSaleBufferDuration,
        _publicSaleDuration: publicSaleDuration,
        _maxTokenPerMintPublicSale: maxTokenPerMintPublicSale,
        _maxTokenPerPersonPublicSale: maxTokenPerPersonPublicSale,
    };

    let Transaction = await NFTFactory.connect(accounts[0]).deployNFTWithPresaleWithRandomdelayed(
        name,
        symbol,
        "Sale Creator",
        baseUri,
        maxSupply,
        "a234",
        Object.values(preSaleConfig),
        Object.values(publicSaleConfig),
        signerAddress
    );

    let receipt = await Transaction.wait(1);
    const event = receipt.events.find((event) => event.event === "SaleCreated");
    const [clone, _saleID] = event.args;

    // console.log(`NFTWithPresaleWithRandomDelayed contract address: ${clone}`);
    // console.log("Sale ID:", _saleID.toString());
    NFT = await ethers.getContractAt("NFTWithPresaleWithRandomDelayed", clone);

    const feeWallet = (await ethers.getSigners())[1]
    
    await NFTFactory.setDropFee(NFT.address, feeWallet.address, "250");

    return { NFT, NFTFactory, vrfCoordinator, Link };
}

function modify_data(_obj, flag) {
    if (flag) {
        maxSupply = _obj.maxSupply || params.maxSupply;
        preSaleStartTime = _obj.preSaleStartTime || params.preSaleStartTime;
        preSaleMintCost = _obj.preSaleMintCost || params.preSaleMintCost;
        publicSaleMintCost = _obj.publicSaleMintCost || params.publicSaleMintCost;
        preSaleDuration = _obj.preSaleDuration || params.preSaleDuration;
        publicSaleBufferDuration = _obj.publicSaleBufferDuration || params.publicSaleBufferDuration;
        publicSaleDuration = _obj.publicSaleDuration || params.publicSaleDuration;
        maxTokenPerMintPresale = _obj.maxTokenPerMintPresale || params.maxTokenPerMintPresale;
        maxTokenPerMintPublicSale = _obj.maxTokenPerMintPublicSale || params.maxTokenPerMintPublicSale;
        maxTokenPerPersonPublicSale = _obj.maxTokenPerPersonPublicSale || params.maxTokenPerPersonPublicSale;
        limitSupplyInPreSale = _obj.limitSupplyInPreSale || params.limitSupplyInPreSale;
    } else {
        //settting default sale parameters
        maxSupply = params.maxSupply;
        preSaleMintCost = params.preSaleMintCost;
        publicSaleMintCost = params.publicSaleMintCost;
        preSaleStartTime = params.preSaleStartTime;
        preSaleDuration = params.preSaleDuration;
        publicSaleBufferDuration = params.publicSaleBufferDuration;
        publicSaleDuration = params.publicSaleDuration;
        maxTokenPerMintPresale = params.maxTokenPerMintPresale;
        maxTokenPerMintPublicSale = params.maxTokenPerMintPublicSale;
        maxTokenPerPersonPublicSale = params.maxTokenPerPersonPublicSale;
        limitSupplyInPreSale = params.limitSupplyInPreSale;
    }
}

module.exports = {
    deployment,
    modify_data,
    params,
    vrfCoordinator,
    Link,
};
