# NFT-Drop Contracts

This repository includes a collection of nft-drop smart contracts. 


## Installation
```shell
npm install
```

## Compile, Test, Deploy
```shell
npx hardhat compile 
npx hardhat test
GAS_REPORT=true npx hardhat test
npx hardhat node
npx hardhat size-contracts
npx hardhat deploy -- network [[networkName]]
```
To export the ABIs of the contracts, run:
```
npx hardhat export-abi
```
## Base Contracts
Some contracts come packaged together as Base Contracts, which come with one or more features out of the box that you can modify and extend. These contracts are available at `contracts/Base/`.
- [BaseNFT]
- [BaseNFTAirdrop]
- [BaseNFTDelayed]
- [BaseNFTSale]
- [BaseNFTWithPresale]
- [BaseNFTWithoutPresale]
- [BaseNFTWithRandom]

## Sale Contracts
The sale contracts which inherit one or more base contracts, where each sale contract provides different drop functionalities as per requirement. These contracts are available at `contracts/Sales/`.


