import chai, { expect } from "chai";
import { BigNumber, Contract, providers, Wallet } from "ethers";
import { solidity } from "ethereum-waffle";
import { ethers, waffle } from "hardhat";

import { expandTo18Decimals, MINIMUM_LIQUIDITY } from "./utils/utilities";
import { fixture, Fixture } from "./utils/fixture";
import { parseEther, parseUnits } from "ethers/lib/utils";
import { MockERC20 } from "../typechain/MockERC20";
import { TradeRouter } from "../typechain/TradeRouter";
import { BuyBackBurn } from "../typechain";

chai.use(solidity);

const overrides = {
  gasLimit: 9999999,
};
const MaxUint256 = ethers.constants.MaxUint256;
const AddressZero = ethers.constants.AddressZero;

describe("Integration test", () => {
  let wallets: Wallet[];
  let wallet: Wallet;
  let executor: Wallet;
  let token: MockERC20;
  let tradeRouter: TradeRouter;
  let bbb: BuyBackBurn;
  let loadFixture: ReturnType<typeof waffle.createFixtureLoader>;

  before("create fixture loader", async () => {
    wallets = await (ethers as any).getSigners();
    wallet = wallets[0];
    executor = wallets[1];
    loadFixture = waffle.createFixtureLoader(wallets as any);
  });

  beforeEach(async function () {
    const fixtureLoaded = (await loadFixture(fixture as any)) as Fixture;
    token = fixtureLoaded.token;
    tradeRouter = fixtureLoaded.tradeRouter;
    bbb = fixtureLoaded.bbb;
  });

  it("changeSFMToken", async () => {
    const tx = await bbb.changeSFMToken(wallet.address);
    const event = await bbb.queryFilter(bbb.filters.ChangeSFMAddress(), tx.blockNumber, tx.blockNumber);

    expect(event.length).to.equal(1);
    expect(event[0].args.token).to.equal(wallet.address);
  });

  it("changeSFMToken", async () => {
    const tx = await bbb.changeSFMToken(wallet.address);
    const event = await bbb.queryFilter(bbb.filters.ChangeSFMAddress(), tx.blockNumber, tx.blockNumber);

    expect(event.length).to.equal(1);
    expect(event[0].args.token).to.equal(wallet.address);
  });

  it("changeRouter", async () => {
    const tx = await bbb.changeRouter(wallet.address);
    const event = await bbb.queryFilter(bbb.filters.ChangeRouter(), tx.blockNumber, tx.blockNumber);

    expect(event.length).to.equal(1);
    expect(event[0].args.router).to.equal(wallet.address);
  });

  it("changeThreshold", async () => {
    const tx = await bbb.changeThreshold(parseEther("1"));
    const event = await bbb.queryFilter(bbb.filters.ChangeThreshold(), tx.blockNumber, tx.blockNumber);

    expect(event.length).to.equal(1);
    expect(event[0].args.amount).to.equal(parseEther("1"));
  });

  it("buybackandburn function, not trigger", async () => {
    const bbbBalanceBefore = await wallet.provider.getBalance(bbb.address);
    expect(bbbBalanceBefore).to.equal(parseEther("0"));

    await wallet.sendTransaction({ value: parseEther("0.0001"), from: wallet.address, to: bbb.address });
    await bbb.buyBackAndBurn();

    const bbbBalanceAfter = await ethers.provider.getBalance(bbb.address);
    expect(bbbBalanceAfter).to.equal(parseEther("0.0001"));
  });

  it("buybackandburn function, trigger", async () => {
    const bbbBalanceBefore = await wallet.provider.getBalance(bbb.address);
    expect(bbbBalanceBefore).to.equal(parseEther("0"));

    await wallet.sendTransaction({ value: parseEther("0.01"), from: wallet.address, to: bbb.address });
    await bbb.buyBackAndBurn();

    const bbbBalanceAfter = await ethers.provider.getBalance(bbb.address);
    expect(bbbBalanceAfter).to.equal(parseEther("0"));
  });
});
