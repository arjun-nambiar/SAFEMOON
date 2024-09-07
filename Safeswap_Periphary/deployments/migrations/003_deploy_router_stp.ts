import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment): Promise<void> {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("SafeswapRouterSTP", {
    from: deployer,
    log: true,
    proxy: {
      owner: deployer,
      proxyContract: "OptimizedTransparentProxy",
      execute: {
        init: {
          methodName: "initialize",
          args: [
            "0x8008791fdce7d64abf9a266f2c6e6a47b224fc02" /* factory */,
            "0xae13d989dac2f0debff460ac112a837c89baa7cd" /* WETH */,
          ],
        },
      },
    },
  });
};

func.tags = ["SafeswapRouterSTP"];
export default func;
