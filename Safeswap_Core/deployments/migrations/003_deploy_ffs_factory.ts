import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment): Promise<void> {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("SafeswapFactory", {
    from: deployer,
    log: true,
    proxy: {
      proxyContract: "OptimizedTransparentProxy",
      execute: {
        init: {
          methodName: "initialize",
          args: ["0xfafea67CA734B5d5c4a60Bf94Ebe75a0AB5397B8", "0x8c3dA658191F8AEB793E017Da74346b2B4C43a27"],
        },
      },
    },
  });
};

func.tags = ["ffs_factory"];
export default func;
