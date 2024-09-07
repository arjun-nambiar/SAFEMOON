const { ethers } = require("hardhat");
const ethUtil = require('ethereumjs-util');
require("dotenv").config()

//add the new owner address in .env file
const newOwner = process.env.NEW_OWNER_PUBLIC_KEY;

async function main(){

    console.log("Setting up Ownership Rights to", newOwner);

    const {
        deployments: { get },
      } = hre;    

    const erc20TransferProxyData = await get('ERC20TransferProxy')
    const transferProxyData = await get('TransferProxy')
    const erc1155LazyMintTransferProxyData = await get('ERC1155LazyMintTransferProxy')
    const erc721LazyMintTransferProxyData = await get('ERC721LazyMintTransferProxy')

    const erc20TransferProxy = await ethers.getContractAt(erc20TransferProxyData.abi, erc20TransferProxyData.address)
    const transferProxy = await ethers.getContractAt(transferProxyData.abi, transferProxyData.address)

    const erc1155LazyMintTransferProxy = await ethers.getContractAt('ERC1155LazyMintTransferProxy', erc1155LazyMintTransferProxyData.address)
    const erc721LazyMintTransferProxy = await ethers.getContractAt('ERC721LazyMintTransferProxy', erc721LazyMintTransferProxyData.address)

    const exchangeV2 = (await get('ExchangeV2')).address
    const exchange = await ethers.getContractAt('ExchangeV2', exchangeV2);

    const royaltiesRegistryAddress = (await get('RoyaltiesRegistry')).address
    const royalties = await ethers.getContractAt('RoyaltiesRegistry', royaltiesRegistryAddress);

    await erc20TransferProxy.transferOwnership(newOwner);   
    console.log("Transferred Ownership of erc20TransferProxy");

    await transferProxy.transferOwnership(newOwner);
    console.log("Transferred Ownership of transferProxy");

    await erc1155LazyMintTransferProxy.transferOwnership(newOwner);
    console.log("Transferred Ownership of ERC1155LazyMintTransferProxy");
    
    await erc721LazyMintTransferProxy.transferOwnership(newOwner);
    console.log("Transferred Ownership of ERC721LazyMintTransferProxy");

    await exchange.transferOwnership(newOwner);
    console.log("Transferred Ownership of exchange");

    await royalties.transferOwnership(newOwner);
    console.log("Transferred Ownership of royaltiesRegistry");

    const erc721RaribleFactoryC2 = await ethers.getContractAt('ERC721RaribleFactoryC2', (await get('ERC721RaribleFactoryC2')).address)
    const erc1155RaribleFactoryC2 = await ethers.getContractAt('ERC1155RaribleFactoryC2', (await get('ERC1155RaribleFactoryC2')).address)
    const erc721RaribleBeacon = await ethers.getContractAt('ERC721RaribleMinimalBeacon', (await get('ERC721RaribleMinimalBeacon')).address)
    const erc1155RaribleBeacon = await ethers.getContractAt('ERC1155RaribleBeacon', (await get('ERC1155RaribleBeacon')).address)
    const erc1155Rarible = await ethers.getContractAt('ERC1155Rarible', (await get('ERC1155Rarible')).address);
    const erc721Rarible = await ethers.getContractAt('ERC721RaribleMinimal', (await get('ERC721RaribleMinimal')).address)

    await erc721RaribleFactoryC2.transferOwnership(newOwner);
    console.log("Transferred Ownership of erc721RaribleFactoryC2");

    await erc1155RaribleFactoryC2.transferOwnership(newOwner);
    console.log("Transferred Ownership of erc1155RaribleFactoryC2");

    await erc721RaribleBeacon.transferOwnership(newOwner);
    console.log("Transferred Ownership of erc721RaribleBeacon");

    await erc1155RaribleBeacon.transferOwnership(newOwner);
    console.log("Transferred Ownership of erc1155RaribleBeacon");

    await erc1155Rarible.transferOwnership(newOwner);
    console.log("Transferred Ownership of erc1155Rarible");

    await erc721Rarible.transferOwnership(newOwner)
    console.log("Transferred Ownership of erc721Rarible");

    console.log("Done!")
}

main()