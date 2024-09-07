const { ethers, network, upgrades } = require("hardhat");

module.exports = async () => {
  const {
    deployments: { deploy, get },
  } = hre;

  const accounts = await ethers.getSigners();

  const deployer = accounts[0].address;

  const transferProxy = await deploy("TransferProxy", {
    contract: "TransferProxy",
    from: deployer,
  });

  console.log("deployed transferProxy at", transferProxy.address);

  const erc20TransferProxy = await deploy("ERC20TransferProxy", {
    contract: "ERC20TransferProxy",
    from: deployer,
  });

  console.log("deployed erc20TransferProxy at", erc20TransferProxy.address);

  const erc721Proxy = await deploy("ERC721LazyMintTransferProxy", {
    contract: "ERC721LazyMintTransferProxy",
    from: deployer,
    waitConfirmations: network.config.blockConfirmations || 6,
  });

  console.log("deployed ERC721LazyMintTransferProxy at", erc721Proxy.address);

  const erc1155Proxy = await deploy("ERC1155LazyMintTransferProxy", {
    contract: "ERC1155LazyMintTransferProxy",
    from: deployer,
  });

  console.log("deployed ERC1155LazyMintTransferProxy at", erc1155Proxy.address);
};

module.exports.tags = ["all", "transfer-proxy"];
