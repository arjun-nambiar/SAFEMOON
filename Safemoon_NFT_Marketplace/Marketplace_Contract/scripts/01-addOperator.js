const { ethers } = require("hardhat");
const ethUtil = require('ethereumjs-util');

async function main(){

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
    await erc20TransferProxy.addOperator(exchangeV2);   
    await transferProxy.addOperator(exchangeV2);
    await erc1155LazyMintTransferProxy.addOperator(exchangeV2);
    await erc721LazyMintTransferProxy.addOperator(exchangeV2);

    //Setting Lazy-Mint transfer proxies addresses with exchange contract
    const exchange = await ethers.getContractAt('ExchangeV2', exchangeV2);
    await exchange.setTransferProxy(id("ERC721_LAZY"), erc721LazyMintTransferProxyData.address);
    await exchange.setTransferProxy(id("ERC1155_LAZY"), erc1155LazyMintTransferProxyData.address);

    console.log("Done!")

}


function id(str) {
	return `0x${ethUtil.keccak256(str).toString("hex").substring(0, 8)}`;
}

main()