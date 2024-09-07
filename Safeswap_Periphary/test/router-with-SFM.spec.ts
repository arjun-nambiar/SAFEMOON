import chai, { expect } from "chai";
import { BigNumber, Contract, Wallet } from "ethers";
import { solidity } from "ethereum-waffle";
import { ethers, waffle } from "hardhat";

import { expandTo18Decimals, MINIMUM_LIQUIDITY } from "./utils/utilities";
import { V2Fixture, v2Fixture } from "./utils/fixturev2";
import { SafeswapPair } from "../typechain";
import { parseUnits } from "ethers/lib/utils";

chai.use(solidity);

const overrides = {
  gasLimit: 9999999,
};
const MaxUint256 = ethers.constants.MaxUint256;
const AddressZero = ethers.constants.AddressZero;

describe("SafeswapV2Router{01,02}", () => {
  let wallets: Wallet[];
  let wallet: Wallet;
  let token0: Contract;
  let token1: Contract;
  let WETH: Contract;
  let WETHPartner: Contract;
  let factory: Contract;
  let router: Contract;
  let pair: SafeswapPair;
  let WETHPair: Contract;
  let loadFixture: ReturnType<typeof waffle.createFixtureLoader>;

  before("create fixture loader", async () => {
    wallets = await (ethers as any).getSigners();
    wallet = wallets[0];
    loadFixture = waffle.createFixtureLoader(wallets as any);
  });

  beforeEach(async function () {
    const fixture = (await loadFixture(v2Fixture)) as V2Fixture;
    token0 = fixture.safemoon;
    token1 = fixture.token1;
    WETH = fixture.WETH;
    WETHPartner = fixture.safemoon;
    factory = fixture.factoryV2;
    router = fixture.router;
    pair = fixture.pair;
    WETHPair = fixture.WETHPair;
  });

  it("factory, WETH", async () => {
    expect(await router.factory()).to.eq(factory.address);
    expect(await router.WETH()).to.eq(WETH.address);
  });

  it("addLiquidityETH", async () => {
    const WETHPartnerAmount = expandTo18Decimals(1);
    const ETHAmount = expandTo18Decimals(4);

    const expectedLiquidity = expandTo18Decimals(2);
    const WETHPairToken0 = await WETHPair.token0();
    await WETHPartner.approve(router.address, MaxUint256);
    await expect(
      router.addLiquidityETH(
        WETHPartner.address,
        WETHPartnerAmount,
        WETHPartnerAmount,
        ETHAmount,
        wallet.address,
        MaxUint256,
        { ...overrides, value: ETHAmount },
      ),
    )
      .to.emit(WETHPair, "Transfer")
      .withArgs(AddressZero, AddressZero, MINIMUM_LIQUIDITY)
      .to.emit(WETHPair, "Transfer")
      .withArgs(AddressZero, wallet.address, expectedLiquidity.sub(MINIMUM_LIQUIDITY))
      .to.emit(WETHPair, "Sync")
      .withArgs(
        WETHPairToken0 === WETHPartner.address ? WETHPartnerAmount : ETHAmount,
        WETHPairToken0 === WETHPartner.address ? ETHAmount : WETHPartnerAmount,
      )
      .to.emit(WETHPair, "Mint")
      .withArgs(
        router.address,
        WETHPairToken0 === WETHPartner.address ? WETHPartnerAmount : ETHAmount,
        WETHPairToken0 === WETHPartner.address ? ETHAmount : WETHPartnerAmount,
      );

    expect(await WETHPair.balanceOf(wallet.address)).to.eq(expectedLiquidity.sub(MINIMUM_LIQUIDITY));
  });

  it("addLiquidityETH - 02", async () => {
    const WETHPartnerAmount = expandTo18Decimals(10);
    const ETHAmount = expandTo18Decimals(40);

    const expectedLiquidity = expandTo18Decimals(20);
    const WETHPairToken0 = await WETHPair.token0();
    await WETHPartner.approve(router.address, MaxUint256);
    await expect(
      router.addLiquidityETH(
        WETHPartner.address,
        WETHPartnerAmount,
        WETHPartnerAmount,
        ETHAmount,
        wallet.address,
        MaxUint256,
        { ...overrides, value: ETHAmount },
      ),
    )
      .to.emit(WETHPair, "Transfer")
      .withArgs(AddressZero, AddressZero, MINIMUM_LIQUIDITY)
      .to.emit(WETHPair, "Transfer")
      .withArgs(AddressZero, wallet.address, expectedLiquidity.sub(MINIMUM_LIQUIDITY))
      .to.emit(WETHPair, "Sync")
      .withArgs(
        WETHPairToken0 === WETHPartner.address ? WETHPartnerAmount : ETHAmount,
        WETHPairToken0 === WETHPartner.address ? ETHAmount : WETHPartnerAmount,
      )
      .to.emit(WETHPair, "Mint")
      .withArgs(
        router.address,
        WETHPairToken0 === WETHPartner.address ? WETHPartnerAmount : ETHAmount,
        WETHPairToken0 === WETHPartner.address ? ETHAmount : WETHPartnerAmount,
      );

    expect(await WETHPair.balanceOf(wallet.address)).to.eq(expectedLiquidity.sub(MINIMUM_LIQUIDITY));
  });

  it("removeLiquidityETH", async () => {
    const WETHPartnerAmount = expandTo18Decimals(1);
    const ETHAmount = expandTo18Decimals(4);
    await WETHPartner.transfer(WETHPair.address, WETHPartnerAmount);
    await WETH.deposit({ value: ETHAmount });
    await WETH.transfer(WETHPair.address, ETHAmount);
    await WETHPair.mint(wallet.address, overrides);

    const expectedLiquidity = expandTo18Decimals(2);
    await WETHPair.approve(router.address, MaxUint256);
    await token0.transfer(token0.address, parseUnits("0.011", 9));
    await expect(
      router.removeLiquidityETHSupportingFeeOnTransferTokens(
        WETHPartner.address,
        expectedLiquidity.sub(MINIMUM_LIQUIDITY),
        0,
        0,
        wallet.address,
        MaxUint256,
        overrides,
      ),
    ).to.not.reverted;
  });
});
