import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import { config as dotenvConfig } from "dotenv";
import { readdirSync } from "fs";
import "hardhat-contract-sizer";
import "hardhat-deploy";
import "hardhat-gas-reporter";
import { HardhatUserConfig } from "hardhat/config";
import { NetworkUserConfig } from "hardhat/types";
import { join, resolve } from "path";
import "solidity-coverage";

dotenvConfig({ path: resolve(__dirname, "./.env") });

// init typechain for the first time
try {
  readdirSync(join(__dirname, "typechain"));
  require("./tasks");
} catch {
  //
}

const chainIds = {
  arbitrum: 421613,
  avalanche: 43113,
  bsc: 56,
  hardhat: 31337,
  mainnet: 1,
  optimism: 10,
  "polygon-mainnet": 137,
  "polygon-mumbai": 80001,
  ropsten: 3,
  kovan: 42,
  rinkeby: 4,
  goerli: 5,
  bsctestnet: 97,
  mumbai: 80001,
  sepolia: 11155111,
  base:84531,
};

// Ensure that we have all the environment variables we need.
const deployerPrivateKey: string | undefined = process.env.DEPLOYER_PRIVATE_KEY;
if (!deployerPrivateKey) {
  throw new Error("Please set your DEPLOYER_PRIVATE_KEY in a .env file");
}

const infuraApiKey: string | undefined = process.env.INFURA_API_KEY;
if (!infuraApiKey) {
  throw new Error("Please set your INFURA_API_KEY in a .env file");
}

const etherscanApiKey: string | undefined = process.env.ETHERSCAN_API_KEY;
if (!etherscanApiKey) {
  throw new Error("Please set your ETHERSCAN_API_KEY in a .env file");
}

function getChainConfig(chain: keyof typeof chainIds): NetworkUserConfig {
  let jsonRpcUrl: string;
  switch (chain) {
    // case "avalanche":
    //   jsonRpcUrl = "https://api.avax.network/ext/bc/C/rpc";
    //   break;
    case "bsc":
      jsonRpcUrl = "https://bsc-dataseed1.binance.org";
      break;
    case "bsctestnet":
      jsonRpcUrl = "https://data-seed-prebsc-1-s2.binance.org:8545";
      // jsonRpcUrl = "https://bsctestapi.terminet.io/rpc";
      break;
    case "sepolia":
      jsonRpcUrl = "https://rpc.sepolia.org";
      break;
    case "mumbai":
      jsonRpcUrl = "https://rpc.ankr.com/polygon_mumbai";
      break;
    case "arbitrum":
      jsonRpcUrl = "https://arb-goerli.g.alchemy.com/v2/Dzkz8rh8lWiy8R8tshC42Q16ySUoq5Ct";
      break;
    case "avalanche":
      jsonRpcUrl = "https://api.avax-test.network/ext/C/rpc";
      break;
    case "base":
      jsonRpcUrl = "https://base-goerli.rpc.thirdweb.com";
      break;
    default:
      jsonRpcUrl = "https://" + chain + ".infura.io/v3/" + infuraApiKey;
  }

  return {
    accounts: [`0x${deployerPrivateKey}`],
    chainId: chainIds[chain],
    url: jsonRpcUrl,
  };
}

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  gasReporter: {
    currency: "USD",
    enabled: process.env.REPORT_GAS ? true : false,
    excludeContracts: [],
    src: "./contracts",
  },
  networks: {
    hardhat: {
      chainId: chainIds.hardhat,
    },
    arbitrum: getChainConfig("arbitrum"),
    avalanche: getChainConfig("avalanche"),
    bsc: getChainConfig("bsc"),
    mainnet: getChainConfig("mainnet"),
    optimism: getChainConfig("optimism"),
    "polygon-mainnet": getChainConfig("polygon-mainnet"),
    "polygon-mumbai": getChainConfig("polygon-mumbai"),
    rinkeby: getChainConfig("rinkeby"),
    goerli: getChainConfig("goerli"),
    kovan: getChainConfig("kovan"),
    ropsten: getChainConfig("ropsten"),
    bsctestnet: getChainConfig("bsctestnet"),
    sepolia: getChainConfig("sepolia"),
    mumbai: getChainConfig("mumbai"),
    base: getChainConfig("base"),
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
    deploy: "./deployments/migrations",
    deployments: "./deployments/artifacts",
  },
  solidity: {
    compilers: [
      {
        version: "0.8.11",
        settings: {
          // Disable the optimizer when debugging
          // https://hardhat.org/hardhat-network/#solidity-optimizer-support
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.6.6",
        settings: {
          // Disable the optimizer when debugging
          // https://hardhat.org/hardhat-network/#solidity-optimizer-support
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
     
    ],
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
  namedAccounts: {
    deployer: 0,
  },
  etherscan: {
    apiKey:etherscanApiKey,
    customChains: [
      {
        network: "base",
        chainId: 84531,
        urls: {
          apiURL: "https://api-goerli.basescan.org/api",
          browserURL: "https://goerli.basescan.org"
        }
      }
    ]
  }
};

export default config;
