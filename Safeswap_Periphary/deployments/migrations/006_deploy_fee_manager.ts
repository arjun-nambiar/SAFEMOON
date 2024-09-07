import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment): Promise<void> {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("FeeJar", {
    from: deployer,
    log: true,
    proxy: {
      owner: deployer,
      proxyContract: "OptimizedTransparentProxy",
      execute: {
        init: {
          methodName: "initialize",
          args: [
            "0x8868F1b2aafc2afBF24076Aa6829024A1385A047" /* FeeJar Admin */,
            "0x8868F1b2aafc2afBF24076Aa6829024A1385A047" /* Fee Setter */,
            "0xc87399af919d98066C5A050368f4a7fe42eF0a45" /* buy back and burn Collector */,
            "0x8868F1b2aafc2afBF24076Aa6829024A1385A047" /* sfmv2 */,
            "0x47a5FB4ee97aaA52EB96d6874fcE089767000288" /* Factory */,
            10000,
            1200 /* BBB Fee */,
            6800 /* LP Fee */,
            2000 /* Support Fee */,
          ],
        },
      },
    },
  });
};

func.tags = ["feeManager"];
export default func;
