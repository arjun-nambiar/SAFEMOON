import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment): Promise<void> {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("BuyBackBurn", {
    from: deployer,
    log: true,
    proxy: {
      owner: deployer,
      proxyContract: "OptimizedTransparentProxy",
    },
  });
};

func.tags = ["upgrade"];
export default func;
