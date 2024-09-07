import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment): Promise<void> {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("SafeswapRouter", {
    from: deployer,
    log: true,
    proxy: {
      owner: deployer,
      proxyContract: "OptimizedTransparentProxy",
      execute: {
        init: {
          methodName: "initialize",
          args: [
            "0x4d4b6573aeAB920289b23E7826B9CB3AA7e22EEF" /* factory */,
            "0xae13d989dac2f0debff460ac112a837c89baa7cd" /* WETH */,
          ],
        },
      },
    },
  });
};

func.tags = ["SafeswapRouterFFS"];
export default func;
