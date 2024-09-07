require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();
require("solidity-coverage");
require("hardhat-abi-exporter");
require("hardhat-deploy");
require("hardhat-contract-sizer");
// require("@primitivefi/hardhat-dodoc");

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;
const MATIC_MUMBAI_RPC_URL = process.env.MATIC_MUMBAI_RPC_URL;
const ROPSTEN_RPC_URL = process.env.ROPSTEN_RPC_URL;
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL;
const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL;
const MATIC_RPC_URL = process.env.MATIC_RPC_URL;
const BSC_RPC_URL = process.env.BSC_RPC_URL;
const TESTNET_RPC_URL = process.env.TESTNET_RPC_URL;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        version: "0.8.17",
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
            allowUnlimitedContractSize: true,
        },
        localhost: {
            url: "http://127.0.0.1:8545/",
            chainId: 31337,
            gas: 10000000,
            gasPrice: 130000000000,
            allowUnlimitedContractSize: true,
        },
        goerli: {
            url: process.env.GOERLI_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 5,
        },
        mumbai: {
            url: MATIC_MUMBAI_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 80001,
        },
        testnet: {
            url: TESTNET_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 97,
        },
        sepolia: {
            url: process.env.SEPOLIA_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 11155111,
        },
        mainnet: {
            url: MAINNET_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 1,
        },
        // matic: {
        //     url: MATIC_RPC_URL,
        //     accounts: [PRIVATE_KEY],
        //     chainId: 137,
        // },
        // bsc: {
        //     url: BSC_RPC_URL,
        //     accounts: [PRIVATE_KEY],
        //     chainId: 56,
        // },
    },
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts",
    },
    gasReporter: {
        enabled: true, //true to generate gas report
        currency: "USD",
        coinmarketcap: COINMARKETCAP_API_KEY,
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
        path: "./docs",
        clear: true,
        runOnCompile: false,
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
        creator: {
            default: 1,
        },
        nonWhitelisted: {
            default: 2,
        },
        affiliatedUser: {
            default: 3,
        },
        signerAddress: {
            default: 4,
        },
    },
    mocha: {
        timeout: 40000,
    },
};
