//const BridgeEth = artifacts.require('./BridgeEth.sol');

const privKey = '90dfbaec58b7fb13043c157205d488d7da044307d1e0cb0217c19bc2ad1bcb9c';
const Web3 = new Web3();

//module.exports = async done => {
  const nonce = 3 ; //Need to increment this for each new transfer
  //const accounts = await web3.eth.getAccounts();
 // console.log(accounts[0]);
  //const bridgeEth = await BridgeEth.deployed();
  const amount = 100;
  const message = Web3.utils.soliditySha3(
    {t: 'address', v: 0x78eDaaDEe19AE1117353Dccb1e5af93155d62bf5},
    {t: 'address', v: 0x78eDaaDEe19AE1117353Dccb1e5af93155d62bf5},
    {t: 'uint256', v: 500000000000},
    {t: 'uint256', v: 1},
  ).toString('hex');
  const { signature } = web3.eth.accounts.sign(
    message, 
    privKey
  ); 
  console.log("*********");
  console.log(signature);
  //await bridgeEth.burn(accounts[0], amount, nonce, signature);
 // done();
//}
