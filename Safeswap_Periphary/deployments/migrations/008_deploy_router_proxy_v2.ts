import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment): Promise<void> {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("SafeswapRouterProxy2", {
    from: deployer,
    log: true,
    // proxy: {
    //   owner: deployer,
      // proxyContract: "OptimizedTransparentProxy",
      // execute: {
      //   init: {
      //     methodName: "initialize",
      //     args: ["0x29d469a7ca63cD79Fe4a9D8bca5DA23A52290008", "0xae13d989dac2f0debff460ac112a837c89baa7cd"],
      //   },
      // },
    // },
  });
};

func.tags = ["router2"];
export default func;
