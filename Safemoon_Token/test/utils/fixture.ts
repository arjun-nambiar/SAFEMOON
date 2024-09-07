import { deployContract, Fixture } from "ethereum-waffle";

import * as SafemoonJSON from "../../artifacts/contracts/Safemoon.sol/Safemoon.json";
import * as OldSafemoonJSON from "../../artifacts/contracts/mock/OldSafemoon.sol/OldSafemoon.json";
import * as FactoryJson from "../../artifacts/contracts/mock/factory/SafeswapFactory.sol/SafeswapFactory.json";
import * as RouterJson from "../../artifacts/contracts/mock/router/SafeswapRouter.sol/SafeswapRouter.json";
import * as ProxyAdminJson from "../../artifacts/contracts/mock/router/proxy/ProxyAdmin/ProxyAdmin.sol/ProxyAdmin.json";
import * as OptimizeProxyJson from "../../artifacts/contracts/mock/router/proxy/OptimizeProxy/OptimizedTransparentUpgradeableProxy.sol/OptimizedTransparentUpgradeableProxy.json";
import * as WETH9Json from "../../artifacts/contracts/mock/router/WETH9.sol/WETH9.json";
import {
  OldSafemoon,
  ProxyAdmin,
  OptimizedTransparentUpgradeableProxy,
  Safemoon,
  SafeswapFactory,
  SafeswapRouter,
  WETH9,
} from "typechain";
import { ethers } from "ethers";

interface IFixture {
  safemoon: Safemoon;
  weth: WETH9;
  router: SafeswapRouter;
}

export const fixture: Fixture<IFixture | any> = async ([wallet, account1, , account2], _) => {
  // const
  const weth = (await deployContract(wallet as any, WETH9Json)) as unknown as WETH9;
  //factory
  const factory = (await deployContract(wallet as any, FactoryJson, [])) as unknown as SafeswapFactory;
  await factory.initialize(wallet.address, wallet.address);
  const router = (await deployContract(wallet as any, RouterJson, [])) as unknown as SafeswapRouter;
  await router.initialize(factory.address, weth.address);
  await factory.setRouter(router.address);
  await factory.deployImplementation();
  await factory.approveLiquidityPartner(router.address);
  await factory.approveLiquidityPartner(wallet.address);
  const safemoon = (await deployContract(wallet as any, SafemoonJSON, [])) as unknown as Safemoon;
  await safemoon.initialize();
  await factory.approveLiquidityPartner(safemoon.address);
  await safemoon.initRouterAndPair(router.address);

  const oldSafemoon = (await deployContract(wallet as any, OldSafemoonJSON)) as unknown as OldSafemoon;
  await factory.approveLiquidityPartner(oldSafemoon.address);
  await oldSafemoon.initialize(router.address);
  return {
    factory,
    safemoon,
    oldSafemoon,
    router,
    weth,
  };
};
