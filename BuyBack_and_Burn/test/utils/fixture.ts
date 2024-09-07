import { parseEther } from "ethers/lib/utils";
import { deployContract } from "ethereum-waffle";
import * as BBBJSON from "../../artifacts/contracts/BuyBackBurn.sol/BuyBackBurn.json";
import * as MockERC20JSON from "../../artifacts/contracts/mocks/MockERC20.sol/MockERC20.json";
import * as TradeRouterJSON from "../../artifacts/contracts/mocks/TradeRouter.sol/TradeRouter.json";
import * as RouterJSON from "../../artifacts/contracts/mocks/Router.sol/Router.json";
import { Wallet } from "ethers";
import { MockERC20 } from "../../typechain/MockERC20";
import { BuyBackBurn } from "../../typechain";
import { TradeRouter } from "../../typechain/TradeRouter";
import { Router } from "../../typechain/Router";

export interface Fixture {
  token: MockERC20;
  bbb: BuyBackBurn;
  tradeRouter: TradeRouter;
}

export const fixture = async ([wallet]: Wallet[], _: any): Promise<Fixture | any> => {
  const token = (await deployContract(wallet as any, MockERC20JSON, ["SFM", "SFM"])) as unknown as MockERC20;
  await token.mint(wallet.address, parseEther("10000"));

  const tradeRouter = (await deployContract(wallet as any, TradeRouterJSON)) as unknown as TradeRouter;
  const router = (await deployContract(wallet as any, RouterJSON)) as unknown as Router;

  await tradeRouter.setRouter(router.address);

  const bbb = (await deployContract(wallet as any, BBBJSON, [])) as unknown as BuyBackBurn;
  await bbb.initialize(parseEther("0.01"), tradeRouter.address, token.address);

  return {
    token,
    bbb,
    tradeRouter,
  };
};
