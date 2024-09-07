const { ethers, network, upgrades } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  const royaltiesRegistryFactory = await ethers.getContractFactory(
    "RoyaltiesRegistry"
  );

  const royalties = await upgrades.deployProxy(royaltiesRegistryFactory, [], {
    // kind: "transparent",
    initializer: "__RoyaltiesRegistry_init",
    unsafeAllowLinkedLibraries: true,
    // waitConfirmations: network.config.blockConfirmations || 6,
  });
  await royalties.deployed();
  await deployments.save("RoyaltiesRegistry", {
    address: royalties.address,
    abi: [],
  });
};

module.exports.tags = ["all", "royalties"];
