import { constants, utils } from "ethers";
import { task } from "hardhat/config";
import {
  FeeJar__factory,
  Safemoon__factory,
  SafeswapFactory__factory,
  SafeswapRouterProxy1__factory,
  SafeSwapTradeRouter__factory,
} from "../typechain";
import { SafeswapRouter01__factory } from "../typechain/factories/SafeswapRouter01__factory";

// task("add", "").setAction(async (_taskArgs, hre) => {
//   const { deployments, ethers } = hre;
//   const [deployer] = await ethers.getSigners();
//   const SafeswapRouter = await deployments.get("SafeswapRouter");
//   const dex = SafeswapRouter__factory.connect(SafeswapRouter.address, ethers.provider);
//   console.log(dex.address);

//   const deadline = Math.floor(Date.now() / 1000) + 86400;
//   await dex
//     .connect(deployer)
//     .addLiquidityETH(
//       "0xada53e625c5cb7de867b197aeab7c39be95b1685",
//       utils.parseEther("0.01"),
//       utils.parseEther("0.01"),
//       utils.parseEther("0.01"),
//       deployer.address,
//       deadline,
//       { value: utils.parseEther("0.01") },
//     );
// });

// task("approve", "").setAction(async (_taskArgs, hre) => {
//   const { deployments, ethers } = hre;
//   const [deployer] = await ethers.getSigners();
//   const SafeswapRouter = await deployments.get("SafeswapRouter");
//   const dex = SafeswapRouter__factory.connect(SafeswapRouter.address, ethers.provider);
//   console.log(dex.address);

//   await dex.connect(deployer).approveLiquidityPartner(deployer.address);
// });

// task("swap", "").setAction(async (_taskArgs, hre) => {
//   const { deployments, ethers } = hre;
//   const [deployer] = await ethers.getSigners();
//   const SafeswapRouter = await deployments.get("SafeswapRouter");
//   const dex = SafeswapRouter__factory.connect(SafeswapRouter.address, ethers.provider);
//   console.log(dex.address);

//   const deadline = Math.floor(Date.now() / 1000) + 86400;
//   await dex
//     .connect(deployer)
//     .swapExactTokensForETH(
//       utils.parseEther("0.001"),
//       0,
//       ["0xada53e625c5cb7de867b197aeab7c39be95b1685", "0x0BaABFc813592eB7f73c949F8C718Cd1baF63180"],
//       deployer.address,
//       deadline,
//     );
// });

const bbb = "0x96Ef7D881c70b1038b7c9494f199Cc08BF2C68E7"; // TODO: change me when call
const sfm = "0x06EADac8f3511Ee499ee2A077356b15344Fc687d"; // TODO: change me when call
const factory = "0x6481e1104F7983bd11D2f137Ee9AdB4576c53Db8"; // TODO: change me when call

task("factory:init", "").setAction(async (_, hre) => {
  const { deployments, ethers } = hre;
  const [deployer] = await ethers.getSigners();
  const ins = SafeswapFactory__factory.connect(factory, ethers.provider);
  const Router1 = await deployments.get("SafeswapRouterProxy1");

  const tx = await ins.connect(deployer).deployImplementation();

  console.log("\x1b[36m%s\x1b[0m", "tx", tx.hash);
  await tx.wait();

  const tx2 = await ins.connect(deployer).approveLiquidityPartner(deployer.address);
  const tx3 = await ins.connect(deployer).approveLiquidityPartner(sfm);
  const tx4 = await ins.connect(deployer).approveLiquidityPartner(Router1.address);

  console.log("\x1b[36m%s\x1b[0m", "[tx2, tx3, tx4]", [tx2, tx3, tx4]);
  await Promise.all([tx2, tx3, tx4]);
});

task("feejar:set-bbb", "").setAction(async (_, hre) => {
  const { deployments, ethers } = hre;
  const [deployer] = await ethers.getSigners();
  const FeeJar = await deployments.get("FeeJar");
  const ins = FeeJar__factory.connect(FeeJar.address, ethers.provider);

  console.log("\x1b[36m%s\x1b[0m", "bbb", bbb);
  const tx = await ins.connect(deployer).setBuyBackAndBurnFeeCollector(bbb);

  console.log("\x1b[36m%s\x1b[0m", "tx", tx.hash);
  await tx.wait();
});

task("router1:set-router2", "").setAction(async (_, hre) => {
  const { deployments, ethers } = hre;
  const [deployer] = await ethers.getSigners();
  const Router1 = await deployments.get("SafeswapRouterProxy1");
  const Router2 = await deployments.get("SafeswapRouterProxy2");
  const ins = SafeswapRouterProxy1__factory.connect(Router1.address, ethers.provider);

  const tx = await ins.connect(deployer).setImpls(1, Router2.address);

  console.log("\x1b[36m%s\x1b[0m", "tx", tx.hash);
  await tx.wait();
});

task("trade-router:whitelist-bbb", "").setAction(async (_, hre) => {
  const { deployments, ethers } = hre;
  const [deployer] = await ethers.getSigners();
  const TradeRouter = await deployments.get("SafeSwapTradeRouter");
  const ins = SafeSwapTradeRouter__factory.connect(TradeRouter.address, ethers.provider);

  console.log("\x1b[36m%s\x1b[0m", "bbb", bbb);
  const tx = await ins.connect(deployer).addFfsWhitelist(bbb);

  console.log("\x1b[36m%s\x1b[0m", "tx", tx.hash);
  await tx.wait();
});

task("sfm:init", "").setAction(async (_, hre) => {
  const { deployments, ethers } = hre;
  const [deployer] = await ethers.getSigners();
  const ins = Safemoon__factory.connect(sfm, ethers.provider);
  const Router1 = await deployments.get("SafeswapRouterProxy1");

  console.log("\x1b[36m%s\x1b[0m", "bbb", bbb);
  const tx = await ins.connect(deployer).excludeFromFee(bbb);

  console.log("\x1b[36m%s\x1b[0m", "tx", tx.hash);
  await tx.wait();

  const tx2 = await ins.connect(deployer).initRouterAndPair(Router1.address);
  console.log("\x1b[36m%s\x1b[0m", "tx2", tx2.hash);
  await tx2.wait();
});
