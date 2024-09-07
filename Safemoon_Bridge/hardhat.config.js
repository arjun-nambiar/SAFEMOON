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
const ETHTESTNET_RPC_URL = "wss://rinkeby.infura.io/ws/v3/d3b429bba0784f2d897fa6888c912e72"
const BSCTESTNET_RPC_URL = "https://data-seed-prebsc-1-s1.binance.org:8545/"
const MNEMONIC = process.env.MNEMONIC
// optional
const PRIVATE_KEY = process.env.PRIVATE_KEY
module.exports = {
  defaultNetwork: "bsctestnet",
  networks: {
    ethtestnet: {
      url: ETHTESTNET_RPC_URL,
       accounts: ["407dc3cba4bbf5ee31934309a3042ee813e9b45242701c20ad93b6ff8310c370"],
    },
    bsctestnet: {
      url: BSCTESTNET_RPC_URL,
       accounts: ["407dc3cba4bbf5ee31934309a3042ee813e9b45242701c20ad93b6ff8310c370"],
    }
  },
  solidity: {
    version: "0.6.6",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },

  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: "H922NUM3RTXX6FDRFFGZIQZX8J7Z441XRF"
  },
}

