import { ecsign } from "ethereumjs-util";
import chai, { expect } from "chai";
import { BigNumber, Contract } from "ethers";
import { MockProvider, solidity } from "ethereum-waffle";
import { ethers, waffle } from "hardhat";

import { expandTo18Decimals, getApprovalDigest, MINIMUM_LIQUIDITY } from "./utils/utilities";
import { V2Fixture, v2Fixture } from "./utils/fixture";
import { SafeswapPair } from "../typechain";

chai.use(solidity);

const overrides = {
  gasLimit: 9999999,
};
const MaxUint256 = ethers.constants.MaxUint256;
const AddressZero = ethers.constants.AddressZero;

describe("SafeswapV2Router{01,02}", () => {
  // let wallet: Wallet;
  let token0: Contract;
  let token1: Contract;
  let WETH: Contract;
  let WETHPartner: Contract;
  let factory: Contract;
  let router: Contract;
  let pair: SafeswapPair;
  let WETHPair: Contract;
  // let loadFixture: ReturnType<typeof waffle.createFixtureLoader>;

  const provider = new MockProvider({
    ganacheOptions: {
      hardfork: "istanbul",
      mnemonic: "horn horn horn horn horn horn horn horn horn horn horn horn",
      gasLimit: 9999999,
    },
  });
  const [wallet] = provider.getWallets();

  // wallets = await (ethers as any).getSigners();
  // wallet = wallets[0];
  const loadFixture = waffle.createFixtureLoader([wallet]);

  // before("create fixture loader", async () => {
  //   const provider = new MockProvider({
  //     ganacheOptions: {
  //       hardfork: "istanbul",
  //       mnemonic: "horn horn horn horn horn horn horn horn horn horn horn horn",
  //       gasLimit: 9999999,
  //     },
  //   });
  //   [wallet] = provider.getWallets();

  //   // wallets = await (ethers as any).getSigners();
  //   // wallet = wallets[0];
  //   loadFixture = waffle.createFixtureLoader([wallet]);
  // });

  beforeEach(async function () {
    const fixture = (await loadFixture(v2Fixture)) as V2Fixture;
    token0 = fixture.token0;
    token1 = fixture.token1;
    WETH = fixture.WETH;
    WETHPartner = fixture.WETHPartner;
    factory = fixture.factoryV2;
    router = fixture.router;
    pair = fixture.pair;
    WETHPair = fixture.WETHPair;
  });

  it("factory, WETH", async () => {
    expect(await router.factory()).to.eq(factory.address);
    expect(await router.WETH()).to.eq(WETH.address);
  });

  async function addLiquidity(token0Amount: BigNumber, token1Amount: BigNumber) {
    await token0.transfer(pair.address, token0Amount);
    await token1.transfer(pair.address, token1Amount);
    await pair.mint(wallet.address, overrides);
  }
  it("removeLiquidity", async () => {
    const token0Amount = expandTo18Decimals(1);
    const token1Amount = expandTo18Decimals(4);
    await addLiquidity(token0Amount, token1Amount);

    const expectedLiquidity = expandTo18Decimals(2);
    await pair.approve(router.address, MaxUint256);
    await expect(
      router.removeLiquidity(
        token0.address,
        token1.address,
        expectedLiquidity.sub(MINIMUM_LIQUIDITY),
        0,
        0,
        wallet.address,
        MaxUint256,
        overrides,
      ),
    )
      .to.emit(pair, "Transfer")
      .withArgs(wallet.address, pair.address, expectedLiquidity.sub(MINIMUM_LIQUIDITY))
      .to.emit(pair, "Transfer")
      .withArgs(pair.address, AddressZero, expectedLiquidity.sub(MINIMUM_LIQUIDITY))
      .to.emit(token0, "Transfer")
      .withArgs(pair.address, wallet.address, token0Amount.sub(500))
      .to.emit(token1, "Transfer")
      .withArgs(pair.address, wallet.address, token1Amount.sub(2000))
      .to.emit(pair, "Sync")
      .withArgs(500, 2000)
      .to.emit(pair, "Burn")
      .withArgs(router.address, token0Amount.sub(500), token1Amount.sub(2000), wallet.address);

    expect(await pair.balanceOf(wallet.address)).to.eq(0);
    const totalSupplyToken0 = await token0.totalSupply();
    const totalSupplyToken1 = await token1.totalSupply();
    expect(await token0.balanceOf(wallet.address)).to.eq(totalSupplyToken0.sub(500));
    expect(await token1.balanceOf(wallet.address)).to.eq(totalSupplyToken1.sub(2000));
  });

  it("removeLiquidityETH", async () => {
    const WETHPartnerAmount = expandTo18Decimals(1);
    const ETHAmount = expandTo18Decimals(4);
    await WETHPartner.transfer(WETHPair.address, WETHPartnerAmount);
    await WETH.deposit({ value: ETHAmount });
    await WETH.transfer(WETHPair.address, ETHAmount);
    await WETHPair.mint(wallet.address, overrides);

    const expectedLiquidity = expandTo18Decimals(2);
    const WETHPairToken0 = await WETHPair.token0();
    await WETHPair.approve(router.address, MaxUint256);
    await expect(
      router.removeLiquidityETH(
        WETHPartner.address,
        expectedLiquidity.sub(MINIMUM_LIQUIDITY),
        0,
        0,
        wallet.address,
        MaxUint256,
        overrides,
      ),
    )
      .to.emit(WETHPair, "Transfer")
      .withArgs(wallet.address, WETHPair.address, expectedLiquidity.sub(MINIMUM_LIQUIDITY))
      .to.emit(WETHPair, "Transfer")
      .withArgs(WETHPair.address, AddressZero, expectedLiquidity.sub(MINIMUM_LIQUIDITY))
      .to.emit(WETH, "Transfer")
      .withArgs(WETHPair.address, router.address, ETHAmount.sub(2000))
      .to.emit(WETHPartner, "Transfer")
      .withArgs(WETHPair.address, router.address, WETHPartnerAmount.sub(500))
      .to.emit(WETHPartner, "Transfer")
      .withArgs(router.address, wallet.address, WETHPartnerAmount.sub(500))
      .to.emit(WETHPair, "Sync")
      .withArgs(
        WETHPairToken0 === WETHPartner.address ? 500 : 2000,
        WETHPairToken0 === WETHPartner.address ? 2000 : 500,
      )
      .to.emit(WETHPair, "Burn")
      .withArgs(
        router.address,
        WETHPairToken0 === WETHPartner.address ? WETHPartnerAmount.sub(500) : ETHAmount.sub(2000),
        WETHPairToken0 === WETHPartner.address ? ETHAmount.sub(2000) : WETHPartnerAmount.sub(500),
        router.address,
      );

    expect(await WETHPair.balanceOf(wallet.address)).to.eq(0);
    const totalSupplyWETHPartner = await WETHPartner.totalSupply();
    const totalSupplyWETH = await WETH.totalSupply();
    expect(await WETHPartner.balanceOf(wallet.address)).to.eq(totalSupplyWETHPartner.sub(500));
    expect(await WETH.balanceOf(wallet.address)).to.eq(totalSupplyWETH.sub(2000));
  });

  it("removeLiquidityWithPermit", async () => {
    const token0Amount = expandTo18Decimals(1);
    const token1Amount = expandTo18Decimals(4);
    await addLiquidity(token0Amount, token1Amount);

    const expectedLiquidity = expandTo18Decimals(2);

    const nonce = await pair.nonces(wallet.address);
    const digest = await getApprovalDigest(
      pair,
      { owner: wallet.address, spender: router.address, value: expectedLiquidity.sub(MINIMUM_LIQUIDITY) },
      nonce,
      MaxUint256,
    );

    const { v, r, s } = ecsign(Buffer.from(digest.slice(2), "hex"), Buffer.from(wallet.privateKey.slice(2), "hex"));

    await router.removeLiquidityWithPermit(
      token0.address,
      token1.address,
      expectedLiquidity.sub(MINIMUM_LIQUIDITY),
      0,
      0,
      wallet.address,
      MaxUint256,
      false,
      v,
      r,
      s,
      overrides,
    );
  });

  it("removeLiquidityETHWithPermit", async () => {
    const WETHPartnerAmount = expandTo18Decimals(1);
    const ETHAmount = expandTo18Decimals(4);
    await WETHPartner.transfer(WETHPair.address, WETHPartnerAmount);
    await WETH.deposit({ value: ETHAmount });
    await WETH.transfer(WETHPair.address, ETHAmount);
    await WETHPair.mint(wallet.address, overrides);

    const expectedLiquidity = expandTo18Decimals(2);

    const nonce = await WETHPair.nonces(wallet.address);
    const digest = await getApprovalDigest(
      WETHPair,
      { owner: wallet.address, spender: router.address, value: expectedLiquidity.sub(MINIMUM_LIQUIDITY) },
      nonce,
      MaxUint256,
    );

    const { v, r, s } = ecsign(Buffer.from(digest.slice(2), "hex"), Buffer.from(wallet.privateKey.slice(2), "hex"));

    await router.removeLiquidityETHWithPermit(
      WETHPartner.address,
      expectedLiquidity.sub(MINIMUM_LIQUIDITY),
      0,
      0,
      wallet.address,
      MaxUint256,
      false,
      v,
      r,
      s,
      overrides,
    );
  });
});
