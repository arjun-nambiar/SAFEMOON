const { constants } = require("ethers");
const { ethers, network } = require("hardhat");
const { networkConfig } = require("../helper-hardhat-config");

module.exports = async (hre) => {
    const {
        deployments: { deploy, get, getOrNull, log, getNamedAccounts },
        ethers: { getSigners },
    } = hre;

    // const { deployer } = await getNamedAccounts();
    const deployer = (await getSigners())[0];

    const chainId = network.config.chainId;

    let vrfCoordinator;
    let Link;
    let KeyHash;
    let Fee;

    const nftWithoutPresaleWithoutRandomInstant = (await get("NFTWithoutPresaleWithoutRandomInstant")).address;
    const nftWithPresaleWithoutRandomInstant = (await get("NFTWithPresaleWithoutRandomInstant")).address;
    const nftWithoutPresaleWithRandomDelayed = (await get("NFTWithoutPresaleWithRandomDelayed")).address;
    const nftWithPresaleWithRandomDelayed = (await get("NFTWithPresaleWithRandomDelayed")).address;

    if (chainId == 31337) {
        const vrfCoordinatorMock = await ethers.getContract("VRFCoordinatorMock");
        const link = await ethers.getContract("LinkToken");

        vrfCoordinator = vrfCoordinatorMock.address;
        Link = link.address;
        KeyHash = networkConfig[5]["KeyHash"];
        Fee = networkConfig[5]["Fee"];

        const NFTFactory = await deploy("NFTFactory", {
            contract: "NFTFactory",
            from: deployer.address,
            args: [
                vrfCoordinator,
                Link,
                KeyHash,
                Fee,
                nftWithoutPresaleWithoutRandomInstant,
                nftWithPresaleWithoutRandomInstant,
                nftWithoutPresaleWithRandomDelayed,
                nftWithPresaleWithRandomDelayed,
            ],
            log: true,
            // waitConfirmations: network.config.blockConfirmations || 6,
        });
    } else {
        vrfCoordinator = networkConfig[chainId]["vrfCoordinator"];
        Link = networkConfig[chainId]["Link"];
        KeyHash = networkConfig[chainId]["KeyHash"];
        Fee = networkConfig[chainId]["Fee"];

        let deployed_contracts = {};

        console.log(`Deploying contracts on ${networkConfig[chainId]["name"]} network`);

        const NFTFactory = await deploy("NFTFactory", {
            contract: "NFTFactory",
            from: deployer.address,
            args: [
                vrfCoordinator,
                Link,
                KeyHash,
                Fee,
                nftWithoutPresaleWithoutRandomInstant,
                nftWithPresaleWithoutRandomInstant,
                nftWithoutPresaleWithRandomDelayed,
                nftWithPresaleWithRandomDelayed,
            ],
            log: true,
        });

        deployed_contracts["NFTFactory"] = NFTFactory.address;
        console.log(deployed_contracts);
    }
};

module.exports.tags = ["all", "NFTFactory"];
module.exports.dependencies = ["impl"];
