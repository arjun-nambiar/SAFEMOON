const { ethers, network } = require("hardhat");

const fn = async function (hre) {
    const {
        deployments: { deploy, get, getOrNull, log },
        ethers: { getSigners },
    } = hre;

    const deployer = (await getSigners())[0];

    const contract = await deploy("NFTWithPresaleWithRandomDelayed", {
        from: deployer.address,
        log: true,
        skipIfAlreadyDeployed: true,
        autoMine: true,
    });

    await hre.deployments.save('NFTWithPresaleWithRandomDelayed', {address: contract.address, abi: contract.abi})

};

fn.tags = ["impl"];

module.exports = fn;
