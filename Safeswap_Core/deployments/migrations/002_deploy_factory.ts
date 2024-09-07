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
          args: ["0x8868F1b2aafc2afBF24076Aa6829024A1385A047", "0x8868F1b2aafc2afBF24076Aa6829024A1385A047"],
        },
      },
      // proxyContract: "OptimizedTransparentProxy",
      // execute: {
      //   init: {
      //     methodName: "initialize",
      //     args: ["0xB910dBBbE99A6F3DDB9b6cA51099Ee05305Da19c", "0xB910dBBbE99A6F3DDB9b6cA51099Ee05305Da19c"],
      //   },
      // },
    },
  });
};

func.tags = ["factory"];
export default func;
