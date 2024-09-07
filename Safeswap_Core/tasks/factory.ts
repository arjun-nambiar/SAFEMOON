import { task } from "hardhat/config";
import { SafeswapFactory__factory } from "../typechain";

task("factory:deploy-impl", "")
  .setAction(async (_, hre) => {
    const { deployments, ethers } = hre;
    const [deployer] = await ethers.getSigners();
    const Factory = await deployments.get("SafeswapFactory");
    const ins = SafeswapFactory__factory.connect(Factory.address, ethers.provider);

    const tx = await ins.connect(deployer).deployImplementation();

    console.log("\x1b[36m%s\x1b[0m", "tx", tx.hash);
    await tx.wait();
  });
