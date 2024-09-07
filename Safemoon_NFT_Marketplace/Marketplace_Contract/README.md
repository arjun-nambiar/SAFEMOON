# Rarible Contract Deployments

## Install

### Prerequisites

- [node](https://www.nodejs.org)

```sh
git clone [GIT_REPOSITORY_URL]
npm install
```
Note: Paste /@rarible folder into node_modules folder. This folder includes all rarible smart contracts.

## Compile contracts

```sh
npx hardhat compile
```

## Deploy Contracts

Create a `.env` file by copying `.env.example`. Input your network node endpoint info as-needed.

Now, follow these steps:

1. Deploy all the transfer proxy contracts by running this command:

```sh
npx hardhat deploy --network [networKName] --tags transfer-proxy
```
2. Deploy ERC1155Factory and ERC721Factory contracts (Make sure you update function arguments (contractURI, title, symbol, etc.) as per requirement) 

```sh
npx hardhat deploy --network [networKName] --tags token
```
3. Deploy RoyatiesRegistry and exchange contract by running the following commands:

```sh
npx hardhat deploy --network [networKName] --tags royalties
```
```sh
npx hardhat deploy --network [networKName] --tags exchange
```

## Run Post Deployment Scripts


```sh
npx hardhat run scripts/00-init.js --network [networKName]
```

```sh
npx hardhat run scripts/01-addOperator.js --network [networKName]
```