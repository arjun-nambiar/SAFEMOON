const { ethers, network, upgrades } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const {
    deployments: { deploy, get },
  } = hre;

  const accounts = await ethers.getSigners();

  const deployer = accounts[0];

  const royaltiesRegistry = (await get("RoyaltiesRegistry")).address;

  const transferProxy = (await get("TransferProxy")).address;

  const erc20TransferProxy = (await get("ERC20TransferProxy")).address;

  const exchangeFactory = await ethers.getContractFactory("ExchangeV2");

  const exchangeV2 = await upgrades.deployProxy(
    exchangeFactory,
    [transferProxy, erc20TransferProxy, 0, deployer.address, royaltiesRegistry],
    {
      kind: "transparent",
      initializer: "__ExchangeV2_init",
      unsafeAllowLinkedLibraries: true,
      // waitConfirmations: network.config.blockConfirmations || 6,
    }
  );
  await exchangeV2.deployed();

  console.log("deployed exchange V2:", exchangeV2.address);

  console.log("Transfer proxy",transferProxy);
  console.log("ERC20 Transfer proxy",erc20TransferProxy);
  console.log("Royality",royaltiesRegistry);
  //console.log();


  await deployments.save("ExchangeV2", {
    address: exchangeV2.address,
    abi: [],
  });
};

module.exports.tags = ["all", "exchange"];
