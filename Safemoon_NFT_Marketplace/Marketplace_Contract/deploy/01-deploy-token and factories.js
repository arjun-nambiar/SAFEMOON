const { ethers, network, upgrades, artifacts } = require("hardhat");

module.exports = async () => {
  const {
    deployments: { deploy, get },
  } = hre;

  const accounts = await ethers.getSigners();

  const deployer = accounts[0].address;

  const erc721LazyMintTransferProxyAddress = (
    await get("ERC721LazyMintTransferProxy")
  ).address;

  const erc1155LazyMintTransferProxyAddress = (
    await get("ERC1155LazyMintTransferProxy")
  ).address;

  const transferProxy = (await get("TransferProxy")).address;

  // ERC1155
  const erc1155Rarible = await ethers.getContractFactory("ERC1155Rarible");

  const erc1155Proxy = await upgrades.deployProxy(
    erc1155Rarible,
    [
      "safe",
      "SAF",
      "ipfs:/",
      "",
      [],
      transferProxy,
      erc1155LazyMintTransferProxyAddress,
    ],
    {
      initializer: "__ERC1155RaribleUser_init",
    }
  );

  await erc1155Proxy.deployed();

  const erc1155Beacon = await deploy("ERC1155RaribleBeacon", {
    args: [erc1155Proxy.address],
    from: deployer,
  });

  const factory1155 = await deploy("ERC1155RaribleFactoryC2", {
    contract: "ERC1155RaribleFactoryC2",
    from: deployer,
    args: [
      erc1155Beacon.address,
      transferProxy,
      erc1155LazyMintTransferProxyAddress,
    ],
  });

  console.log('Deoloyed Arg1',erc1155Beacon.address);
  console.log('Deoloyed Arg2',transferProxy);
  console.log('Deoloyed Arg3',erc1155LazyMintTransferProxyAddress);
  console.log(`deployed factory1155 at ${factory1155.address}`);

  //ERC721
  const erc721Rarible = await ethers.getContractFactory("ERC721RaribleMinimal");
  const erc721Proxy = await upgrades.deployProxy(
    erc721Rarible,
    [
      "Safemoon",
      "SAF",
      "ipfs:/",
      "",
      [],
      transferProxy,
      erc721LazyMintTransferProxyAddress,
    ],
    {
      initializer: "__ERC721RaribleUser_init",
    }
  );

  await erc721Proxy.deployed();

  console.log('Deoloyed Arg',erc721LazyMintTransferProxyAddress);
  console.log("deployed ERC721 Proxy at", erc721Proxy.address);

  const erc721MinimalBeacon = await deploy("ERC721RaribleMinimalBeacon", {
    args: [erc721Proxy.address],
    from: deployer,
  });

  const factory721 = await deploy("ERC721RaribleFactoryC2", {
    contract: "ERC721RaribleFactoryC2",
    from: deployer,
    args: [
      erc721MinimalBeacon.address,
      transferProxy,
      erc721LazyMintTransferProxyAddress,
    ],
  });

  
  console.log('Deoloyed Arg',erc721MinimalBeacon.address);
  console.log(`deployed factory721 at ${factory721.address}`);
};

module.exports.tags = ["all", "token"];
