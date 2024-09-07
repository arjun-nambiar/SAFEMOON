import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment): Promise<void> {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("SafeSwapTradeRouter", {
    from: deployer,
    log: true,
    proxy: {
      owner: deployer,
      proxyContract: "OptimizedTransparentProxy",
      // execute: {
      //   init: {
      //     methodName: "initialize",
      //     args: [
      //       "0x8De4d617D499991aAD5B39C684B697FF3Eea288B" /* feeJar */,
      //       "0xb2FD9590c1d2ab1E6281Ac594694C05bD4bf1b9E" /* router */,
      //       "25",
      //       "10000"
      //     ],
      //   },
      // },
    },
  });
};

func.tags = ["SafeSwapTradeRouter"];
export default func;
