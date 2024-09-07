require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-ethers")
require('@openzeppelin/hardhat-upgrades')
require("@nomiclabs/hardhat-etherscan")

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */ 
//const MAINNET_RPC_URL = "https://data-seed-prebsc-1-s2.binance.org:8545/"
//const MNEMONIC = process.env.MNEMONIC
// optional
//const PRIVATE_KEY = process.env.PRIVATE_KEY

module.exports = {
  solidity: {
    version: "0.8.0",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  defaultNetwork: "testnet",
  networks: {
    testnet: {
      url: "https://data-seed-prebsc-1-s2.binance.org:8545/",
      //url: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
      accounts: ["407dc3cba4bbf5ee31934309a3042ee813e9b45242701c20ad93b6ff8310c370"],
     //accounts: ["d397406f1a5deadb2c6dbb352a772a6ed94189cdf97503a86a5fc1238560f835"],
      chainId: 97,
      //chainId: 4,
    },
    // bsc: {
    //   url: "https://bsc-dataseed1.binance.org",
    //   accounts: ["407dc3cba4bbf5ee31934309a3042ee813e9b45242701c20ad93b6ff8310c370"],
    //   chainId: 56,
    // }
  },
  etherscan: {
    apiKey: "H922NUM3RTXX6FDRFFGZIQZX8J7Z441XRF"
   // apiKey: "28651SQUQPQMSNN2IZ75QFDXU8DWK7B6Z4"
  }
};

