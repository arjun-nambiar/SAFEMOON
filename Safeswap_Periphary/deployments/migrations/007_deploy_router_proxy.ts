import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment): Promise<void> {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("SafeswapRouterProxy1", {
    from: deployer,
    log: true,
    proxy: {
      owner: deployer,
      proxyContract: "OptimizedTransparentProxy",
      execute: {
        init: {
          methodName: "initialize",
          args: ["0x47a5FB4ee97aaA52EB96d6874fcE089767000288" /* change after deploy router */, "0xbB7b5004e80E28Cb384EC44612a621A6a74f92b9"],
        },
      },
    },
  });
};

func.tags = ["router1"];
export default func;
