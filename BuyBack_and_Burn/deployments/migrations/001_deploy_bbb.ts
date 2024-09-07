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
      proxyContract: "OptimizedTransparentProxy",
      owner: deployer,
      execute: {
        init: {
          methodName: "initialize",
          args: [
            "1320000000000000000", // 1.32 BNB
            "0x2514284cEBD23a0E61E2D9Ed12169b9341f2C0D1", //trade router
            "0x8868F1b2aafc2afBF24076Aa6829024A1385A047", // sfm token
          ],
        },
      },
    },
  });
};

func.tags = ["bbb"];
export default func;
