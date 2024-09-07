const Web3 = require('web3');
const BridgeEth = require('../build/contracts/BridgeEth.json');
const BridgeBsc = require('../build/contracts/BridgeBsc.json');

const web3Eth = new Web3('wss://rinkeby.infura.io/ws/v3/d3b429bba0784f2d897fa6888c912e72');
const web3Bsc = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');
const adminPrivKey = '407dc3cba4bbf5ee31934309a3042ee813e9b45242701c20ad93b6ff8310c370';
const { address: admin } = web3Bsc.eth.accounts.wallet.add(adminPrivKey);


const bridgeEth = new web3Eth.eth.Contract(
  BridgeEth.abi,
  BridgeEth.networks['4'].address
);

const bridgeBsc = new web3Bsc.eth.Contract(
  BridgeBsc.abi,
  BridgeBsc.networks['97'].address
); 
  bridgeEth.events.Transfer(
    {fromBlock: 0, step: 0}
  )
    .on('data', async event => {
      console.log('admin',admin);
      console.log(event)
      const { from, to, amount, date, nonce, signature } = event.returnValues;
    
      const tx = bridgeBsc.methods.mint(from, to, amount, nonce, signature);
      const [gasPrice, gasCost] = await Promise.all([
        web3Bsc.eth.getGasPrice(),
        tx.estimateGas({from: admin}),
      ]);
      const data = tx.encodeABI();
      const txData = {
        from: admin,
        to: bridgeBsc.options.address,
        data,
        gas: gasCost,
        gasPrice
      };
      const receipt = await web3Bsc.eth.sendTransaction(txData);
      console.log(`Transaction hash: ${receipt.transactionHash}`);
      console.log(`
        Processed transfer:
        - from ${from} 
        - to ${to} 
        - amount ${amount} tokens
        - date ${date}
        - nonce ${nonce}
      `);
    });
    