
const { ethers } = require("hardhat");

async function operator_init(){

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

    await erc20TransferProxy.__OperatorRole_init();   
    await transferProxy.__OperatorRole_init();
    await erc1155LazyMintTransferProxy.__OperatorRole_init();
    await erc721LazyMintTransferProxy.__OperatorRole_init();

    console.log("Done!")
}

operator_init()