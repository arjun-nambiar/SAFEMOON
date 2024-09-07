require("@nomicfoundation/hardhat-toolbox")
require('@openzeppelin/hardhat-upgrades')
// require("@nomiclabs/hardhat-waffle")
//require("hardhat-gas-reporter")
// require("@nomiclabs/hardhat-etherscan")
require("dotenv").config()
// require("solidity-coverage")
require('hardhat-abi-exporter')
require("hardhat-deploy")
// require('hardhat-contract-sizer')
// require('hardhat-docgen')


const ACCOUNT = process.env.PRIVATE_KEY;
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY; 
const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL;
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL;
const MATIC_MUMBAI_RPC_URL = process.env.MATIC_MUMBAI_RPC_URL;
const MATIC_RPC_URL = process.env.MATIC_RPC_URL;
const BSC_RPC_URL = process.env.BSC_RPC_URL;


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.7.6",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
      gas: 6000000,
      gasPrice: 130000000000,
      allowUnlimitedContractSize: true 
    },
    localhost:{
      url: "http://127.0.0.1:8545/", 
      chainId: 31337,
      gas: 10000000,
      gasPrice: 130000000000,
      allowUnlimitedContractSize: true 
    },
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: [ACCOUNT],
      chainId: 5,
      blockConfirmations: 6
    },
    testnet:{
      url: process.env.TESTNET_RPC_URL,
      accounts: [ACCOUNT],
      chainId: 97
    },
    mumbai: {
      url: MATIC_MUMBAI_RPC_URL,
      accounts: [ACCOUNT],
      chainId: 80001
    },
    mainnet:{
      url: MAINNET_RPC_URL,
      accounts: [ACCOUNT],
      chainId: 1
    },
    bsc:{
      url: BSC_RPC_URL,
      accounts: [ACCOUNT],
      chainId: 56
    },
    matic:{
      url: MATIC_RPC_URL,
      accounts: [ACCOUNT],
      chainId: 137
    }
    },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
    },
  gasReporter:{
    enabled: false, //true to generate gas report
    currency: "USD",
    coinmarketcap: COINMARKETCAP_API_KEY
    // token: "MATIC",
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: false,
    strict: true,
    // only: [':ERC20$'],
  },
  docgen: {
    path: './docs',
    clear: true,
    runOnCompile: false,
  },
  namedAccounts:{
    deployer:{
      default: 0,
    },
    user1:{
      default:1,
    }, 
   
  },
  etherscan: {
    apiKey: "H922NUM3RTXX6FDRFFGZIQZX8J7Z441XRF",
  }
    
};