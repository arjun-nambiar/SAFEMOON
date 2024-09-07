const { ethers, network } = require("hardhat");

//Details: https://docs.chain.link/vrf/v1/supported-networks/

const networkConfig = {
    1: {
        name: "mainnet",
        vrfCoordinator: "0xf0d54349aDdcf704F77AE15b96510dEA15cb7952",
        Link: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
        KeyHash: "0xAA77729D3466CA35AE8D28B3BBAC7CC36A5031EFDC430821C02BC31A238AF445",
        Fee: ethers.utils.parseUnits("2", 18),
    },
    137: {
        name: "polygon-mainnet",
        vrfCoordinator: "0x3d2341ADb2D31f1c5530cDC622016af293177AE0",
        Link: "0xb0897686c545045aFc77CF20eC7A532E3120E0F1",
        KeyHash: "0xf86195cf7690c55907b2b611ebb7343a6f649bff128701cc542f0569e2c549da",
        Fee: ethers.utils.parseUnits("1", 15),
    },
    80001: {
        name: "mumbai",
        vrfCoordinator: "0x8C7382F9D8f56b33781fE506E897a4F1e2d17255",
        Link: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
        KeyHash: "0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4",
        Fee: ethers.utils.parseUnits("1", 15),
    },
    56: {
        name: "bsc-mainnet",
        vrfCoordinator: "0x747973a5A2a4Ae1D3a8fDF5479f1514F65Db9C31",
        Link: "0x404460C6A5EdE2D891e8297795264fDe62ADBB75",
        KeyHash: "0xc251acd21ec4fb7f31bb8868288bfdbaeb4fbfec2df3735ddbd4f7dc8d60103c", 
        Fee: ethers.utils.parseUnits("1", 17),
    },
    5: {
        name: "goerli",
        vrfCoordinator: "0x2bce784e69d2Ff36c71edcB9F88358dB0DfB55b4",
        Link: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
        KeyHash: "0x0476f9a745b61ea5c0ab224d3a6e4c99f0b02fce4da01143a4f70aa80ae76e8a", //200 gwei gasLane
        Fee: ethers.utils.parseUnits("1", 17),
    },
    97: {
        name: "testnet",
        vrfCoordinator: "0xa555fC018435bef5A13C6c6870a9d4C11DEC329C",
        Link: "0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06",
        KeyHash: "0xcaf3c3727e033261d383b315559476f48034c13b18f8cafed4d871abe5049186", //200 gwei gasLane
        Fee: ethers.utils.parseUnits("1", 17),
    },
    11155111: {
        name: "sepolia",
        vrfCoordinator: "0xa555fC018435bef5A13C6c6870a9d4C11DEC329C",
        Link: "0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06",
        KeyHash: "0xcaf3c3727e033261d383b315559476f48034c13b18f8cafed4d871abe5049186", //200 gwei gasLane
        Fee: ethers.utils.parseUnits("1", 17),
    },
};

module.exports = {
    networkConfig,
};
