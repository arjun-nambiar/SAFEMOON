import { deployContract } from "ethereum-waffle";

import { expandTo18Decimals } from "./utilities";

import Factory from "../../artifacts/contracts/factory/SafeswapFactory.sol/SafeswapFactory.json";
import IPair from "../../artifacts/contracts/factory/interfaces/ISafeswapPair.sol/ISafeswapPair.json";
import { bytecode } from "../../artifacts/contracts/factory/SafeswapPair.sol/SafeswapPair.json";
import * as SafemoonJSON from "../../artifacts/contracts/SFMMock/Safemoon.sol/Safemoon.json";

import ERC20 from "../../artifacts/contracts/test/ERC20.sol/ERC20.json";
import WETH9 from "../../artifacts/contracts/test/WETH9.sol/WETH9.json";
import Router02 from "../../artifacts/contracts/SafeswapRouter.sol/SafeswapRouter.json";
import {
  IERC20,
  ISafeswapFactory,
  ISafeswapPair,
  ISafeswapRouter02,
  IWETH,
  SafeswapFactory,
  SafeswapPair,
  SafeswapRouter,
  Safemoon
} from "../../typechain";
import { Contract, Wallet } from "ethers";
import { keccak256 } from "@ethersproject/solidity";

const COMPUTED_INIT_CODE_HASH = keccak256(["bytes"], [`${bytecode}`]);
console.log("\x1b[36m%s\x1b[0m", "COMPUTED_INIT_CODE_HASH", COMPUTED_INIT_CODE_HASH);
const overrides = {
  gasLimit: 9999999,
};

export interface V2Fixture {
  token0: IERC20;
  token1: IERC20;
  WETH: IWETH;
  WETHPartner: IERC20;
  factoryV2: ISafeswapFactory;
  router02: ISafeswapRouter02;
  router: ISafeswapRouter02;
  pair: SafeswapPair;
  WETHPair: ISafeswapPair;
  safemoon: Safemoon;
}

export const v2Fixture = async ([wallet]: Wallet[], _: any): Promise<V2Fixture | any> => {
  const safemoon = (await deployContract(wallet as any, SafemoonJSON)) as unknown as Safemoon;
  await safemoon.initialize();

  // deploy tokens
  const tokenA = ((await deployContract(wallet as any, ERC20, [expandTo18Decimals(10000)])) as unknown) as IERC20;
  const tokenB = ((await deployContract(wallet as any, ERC20, [expandTo18Decimals(10000)])) as unknown) as IERC20;
  const WETH = ((await deployContract(wallet as any, WETH9)) as unknown) as IWETH;
  const WETHPartner = ((await deployContract(wallet as any, ERC20, [expandTo18Decimals(10000)])) as unknown) as IERC20;

  // deploy V2
  const factoryV2 = ((await deployContract(wallet as any, Factory, [])) as unknown) as SafeswapFactory;
  await factoryV2.initialize(wallet.address, wallet.address, wallet.address, 100, 100, 100);

  // deploy routers
  const router02 = ((await deployContract(wallet as any, Router02, [], overrides)) as unknown) as SafeswapRouter;
  await router02.initialize(factoryV2.address, WETH.address);

  // initialize V2
  await factoryV2.approveLiquidityPartner(wallet.address);
  await factoryV2.createPair(tokenA.address, tokenB.address, wallet.address);
  const pairAddress = await factoryV2.getPair(tokenA.address, tokenB.address);
  const pair = (new Contract(pairAddress, JSON.stringify(IPair.abi), wallet).connect(
    wallet,
  ) as unknown) as SafeswapPair;

  const token0Address = await pair.token0();
  const token0 = tokenA.address === token0Address ? tokenA : tokenB;
  const token1 = tokenA.address === token0Address ? tokenB : tokenA;

  await factoryV2.createPair(WETH.address, WETHPartner.address, wallet.address);
  const WETHPairAddress = await factoryV2.getPair(WETH.address, WETHPartner.address);
  const WETHPair = (new Contract(WETHPairAddress, JSON.stringify(IPair.abi), wallet).connect(
    wallet,
  ) as unknown) as ISafeswapPair;

  await factoryV2.approveLiquidityPartner(router02.address);

  return {
    token0,
    token1,
    WETH,
    WETHPartner,
    factoryV2,
    router02,
    router: router02, // the default router, 01 had a minor bug
    pair,
    WETHPair,
    safemoon
  };
};
