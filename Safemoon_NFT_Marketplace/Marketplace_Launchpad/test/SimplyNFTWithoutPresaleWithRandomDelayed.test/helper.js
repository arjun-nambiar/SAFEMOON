const { ethers, BigNumber, deployments, getNamedAccounts } = require("hardhat");
const { time, loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

const name = "Example";
const symbol = "EXPL";
const baseUri = "https://example.com/";

//Default sale parameters of a shop
var params = {
    maxSupply: 1000,
    publicSaleMintCost: 1000,
    publicSaleStartTime: setTime(),
    publicSaleDuration: 120,
    maxTokenPerMintPublicSale: 5,
    maxTokenPerPersonPublicSale: 8,
};

async function setTime() {
    return (await time.latest()) + 200;
}

//initializing with default sale paramters
let maxSupply = params.maxSupply;
let publicSaleMintCost = params.publicSaleMintCost;
let publicSaleStartTime = params.publicSaleStartTime;
//let preSaleDuration =  params.preSaleDuration;
//let publicSaleBufferDuration = params.publicSaleBufferDuration;
let publicSaleDuration = params.publicSaleDuration;
let maxTokenPerMintPublicSale = params.maxTokenPerMintPublicSale;
let maxTokenPerPersonPublicSale = params.maxTokenPerPersonPublicSale;
let deployer;
let signerAddress;
let shopCreator;

async function deployment() {
    let NFTFactory, NFTWithoutPresale;

    deployer = (await getNamedAccounts()).deployer;

    signerAddress = (await getNamedAccounts()).signerAddress;

    shopCreator = (await getNamedAccounts()).creator;

    let accounts = await ethers.getSigners();

    await deployments.fixture(["all"]);

    NFTFactory = await ethers.getContract("NFTFactory", deployer);

    let publicSaleConfig = {
        _publicSaleMintCost: publicSaleMintCost,
        _publicSaleStartTime: publicSaleStartTime,
        _publicSaleDuration: publicSaleDuration,
        _maxTokenPerMintPublicSale: maxTokenPerMintPublicSale,
        _maxTokenPerPersonPublicSale: maxTokenPerPersonPublicSale,
    };

    let Transaction = await NFTFactory.connect(accounts[0]).deployNFTWithoutPresaleWithRandomdelayed(
        name,
        symbol,
        "Sale Creator",
        baseUri,
        maxSupply,
        "a1",
        Object.values(publicSaleConfig),
        signerAddress
    );
    let receipt = await Transaction.wait(1);
    const event = receipt.events.find((event) => event.event === "SaleCreated");
    const [clone, _saleID] = event.args;

    NFTWithoutPresale = await ethers.getContractAt("NFTWithoutPresaleWithRandomDelayed", clone);

    const feeWallet = (await ethers.getSigners())[1]
    
    await NFTFactory.setDropFee(NFTWithoutPresale.address, feeWallet.address, "250");

    return { NFTWithoutPresale, NFTFactory };
}

function modify_data(_obj, flag) {
    if (flag) {
        maxSupply = _obj.maxSupply || params.maxSupply;
        publicSaleStartTime = _obj.publicSaleStartTime || params.publicSaleStartTime;
        publicSaleMintCost = _obj.publicSaleMintCost || params.publicSaleMintCost;
        publicSaleDuration = _obj.publicSaleDuration || params.publicSaleDuration;
        maxTokenPerMintPublicSale = _obj.maxTokenPerMintPublicSale || params.maxTokenPerMintPublicSale;
        maxTokenPerPersonPublicSale = _obj.maxTokenPerPersonPublicSale || params.maxTokenPerPersonPublicSale;
    } else {
        //settting default sale parameters
        maxSupply = params.maxSupply;
        publicSaleMintCost = params.publicSaleMintCost;
        publicSaleStartTime = params.publicSaleStartTime;
        publicSaleDuration = params.publicSaleDuration;
        maxTokenPerMintPublicSale = params.maxTokenPerMintPublicSale;
        maxTokenPerPersonPublicSale = params.maxTokenPerPersonPublicSale;
    }
}

module.exports = {
    deployment,
    modify_data,
};
