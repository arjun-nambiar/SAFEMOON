import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment): Promise<void> {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

 const ab =  await deploy("Safemoon", {
    from: deployer,
    log: true,
    proxy: {
      proxyContract: "OptimizedTransparentProxy",
      owner: deployer,
      execute: {
        init: {
          methodName: "initialize",
          args: [],
        },
        // onUpgrade: {
        //   methodName: "updateTotalExcluded",
        //   args: [],
        // },
      },
    },
  });

  console.log(ab);
};

func.tags = ["Safemoon"];
export default func;
