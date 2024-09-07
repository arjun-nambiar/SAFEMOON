import { SafeswapFactory, IERC20, SafeswapPair } from "../../typechain";
import { deployContract, Fixture } from "ethereum-waffle";

import * as ERC20JSON from "../../artifacts/contracts/test/ERC20.sol/ERC20.json";
import * as FactoryJSON from "../../artifacts/contracts/SafeswapFactory.sol/SafeswapFactory.json";
import * as PairJSON from "../../artifacts/contracts/SafeswapPair.sol/SafeswapPair.json";
import { Contract, ethers } from "ethers";

interface IFixture {
  token0: IERC20;
  token1: IERC20;
  factory: SafeswapFactory;
  pair: SafeswapPair;
}

export const fixture: Fixture<IFixture | any> = async ([wallet, account1, , treasury], _) => {
  // deploy tokens
  const token0 = ((await deployContract(wallet as any, ERC20JSON, [
    ethers.utils.parseEther("100000000"),
  ])) as unknown) as IERC20;

  const token1 = ((await deployContract(wallet as any, ERC20JSON, [
    ethers.utils.parseEther("100000000"),
  ])) as unknown) as IERC20;

  const factory = ((await deployContract(wallet as any, FactoryJSON, [])) as unknown) as SafeswapFactory;
  await factory.initialize(wallet.address, wallet.address);
  await factory.approveLiquidityPartner(wallet.address);

  await factory.deployImplementation();
  await factory.createPair(token0.address, token1.address, wallet.address);
  const pairAddress = await factory.getPair(token0.address, token1.address);
  const pair = new Contract(pairAddress, JSON.stringify(PairJSON.abi), wallet).connect(wallet) as SafeswapPair;

  return {
    token0,
    token1,
    factory,
    pair,
  };
};
