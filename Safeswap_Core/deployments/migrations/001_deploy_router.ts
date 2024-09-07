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
          args: ["0x209fa0e6b6c38Dab1afb4380AceC186b5E884f9B", "0x0BaABFc813592eB7f73c949F8C718Cd1baF63180"],
        },
      },
    },
  });
};

func.tags = ["router"];
export default func;
