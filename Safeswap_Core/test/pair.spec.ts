import { IERC20 } from "../typechain/interfaces/IERC20";
import { SafeswapFactory, SafeswapPair, SafeswapPair__factory } from "../typechain";
import { ethers, waffle } from "hardhat";
import { BigNumber, Wallet } from "ethers";
import { fixture } from "./utils/fixture";
import { expect } from "chai";
import { formatEther, parseEther } from "ethers/lib/utils";

describe("Safemoon", () => {
  let wallets: Wallet[];
  let deployer: Wallet;
  let account1: Wallet;
  let account2: Wallet;
  let account3: Wallet;
  let factory: SafeswapFactory;
  let token0: IERC20;
  let token1: IERC20;
  let pair: SafeswapPair;
  let loadFixture: ReturnType<typeof waffle.createFixtureLoader>;
  const zeroAddr = ethers.constants.AddressZero;
  const overrides = {
    gasLimit: 9999999,
  };
  const MINIMUM_LIQUIDITY = ethers.BigNumber.from(10).pow(3);

  before("create fixture loader", async () => {
    wallets = await (ethers as any).getSigners();
    deployer = wallets[0];
    account1 = wallets[1];
    account2 = wallets[2];
    account3 = wallets[3];
    loadFixture = waffle.createFixtureLoader(wallets as any);
  });

  beforeEach(async () => {
    ({ token0, token1, factory, pair } = await loadFixture(fixture));
  });

  it("mint with blacklisted wallet", async () => {
    await factory.blacklistAddress(deployer.address);
    await expect(pair.mint(deployer.address)).to.revertedWith("Address is blacklisted");
  });

  it("mint without blacklisted wallet", async () => {
    // transfer token 0 and token 1 to pair
    // await token0.transfer(pair.address, parseEther("100"));
    // await token1.transfer(pair.address, parseEther("100"));
    await pair.mint(deployer.address);
  });

  it("mint without blacklisted wallet", async () => {
    // transfer token 0 and token 1 to pair
    await token0.transfer(pair.address, parseEther("10000"));
    await token1.transfer(pair.address, parseEther("10000"));
    await pair.mint(deployer.address);

    await token0.transfer(pair.address, parseEther("100"));
    const preReserves = await pair.getReserves();
    console.log("\x1b[36m%s\x1b[0m", "pre _reserve0", formatEther(preReserves._reserve0));
    console.log("\x1b[36m%s\x1b[0m", "pre _reserve1", formatEther(preReserves._reserve1));
    await pair.swap(0, parseEther("1"), account1.address, "0x");
    const postReserves = await pair.getReserves();
    const acc1Token1 = await token1.balanceOf(account1.address);
    console.log("\x1b[36m%s\x1b[0m", "acc1Token1", formatEther(acc1Token1));
    console.log("\x1b[36m%s\x1b[0m", "_reserve0", formatEther(postReserves._reserve0));
    console.log("\x1b[36m%s\x1b[0m", "_reserve1", formatEther(postReserves._reserve1));
  });

  // it("mint", async () => {
  //   const token0Amount = parseEther("1");
  //   const token1Amount = parseEther("4");
  //   await token0.transfer(pair.address, token0Amount);
  //   await token1.transfer(pair.address, token1Amount);

  //   const expectedLiquidity = parseEther("2");
  //   await expect(pair.mint(deployer.address, overrides))
  //     .to.emit(pair, "Transfer")
  //     .withArgs(zeroAddr, zeroAddr, MINIMUM_LIQUIDITY)
  //     .to.emit(pair, "Transfer")
  //     .withArgs(zeroAddr, deployer.address, expectedLiquidity.sub(MINIMUM_LIQUIDITY))
  //     .to.emit(pair, "Sync")
  //     .withArgs(token0Amount, token1Amount)
  //     .to.emit(pair, "Mint")
  //     .withArgs(deployer.address, token0Amount, token1Amount);

  //   expect(await pair.totalSupply()).to.eq(expectedLiquidity);
  //   expect(await pair.balanceOf(deployer.address)).to.eq(expectedLiquidity.sub(MINIMUM_LIQUIDITY));
  //   expect(await token0.balanceOf(pair.address)).to.eq(token0Amount);
  //   expect(await token1.balanceOf(pair.address)).to.eq(token1Amount);
  //   const reserves = await pair.getReserves();
  //   expect(reserves[0]).to.eq(token0Amount);
  //   expect(reserves[1]).to.eq(token1Amount);
  // });

  // async function addLiquidity(token0Amount: BigNumber, token1Amount: BigNumber) {
  //   await token0.transfer(pair.address, token0Amount);
  //   await token1.transfer(pair.address, token1Amount);
  //   await pair.mint(deployer.address, overrides);
  // }

  // const swapTestCases: BigNumber[][] = [
  //   [1, 5, 10, "1663887962654218072"],
  //   [1, 10, 5, "453718857974177123"],

  //   [2, 5, 10, "2853058890794739851"],
  //   [2, 10, 5, "831943981327109036"],

  //   [1, 10, 10, "907437715948354246"],
  //   [1, 100, 100, "988138378977801540"],
  //   [1, 1000, 1000, "997004989020957084"],
  // ].map(a => a.map(n => (typeof n === "string" ? ethers.BigNumber.from(n) : parseEther(n.toString()))));
  // swapTestCases.forEach((swapTestCase, i) => {
  //   it(`getInputPrice:${i}`, async () => {
  //     const [swapAmount, token0Amount, token1Amount, expectedOutputAmount] = swapTestCase;
  //     await addLiquidity(token0Amount, token1Amount);
  //     await token0.transfer(pair.address, swapAmount);
  //     await expect(pair.swap(0, expectedOutputAmount.add(1), deployer.address, "0x", overrides)).to.be.revertedWith(
  //       "Safeswap: K",
  //     );
  //     await pair.swap(0, expectedOutputAmount, deployer.address, "0x", overrides);
  //   });
  // });

  // it("swap with blacklisted wallet", async () => {
  //   await factory.blacklistAddress(deployer.address);
  //   await expect(pair.swap(parseEther("5"), parseEther("5"), deployer.address, "0x")).to.revertedWith(
  //     "Address is blacklisted",
  //   );
  // });

  // it("burn with blacklisted wallet", async () => {
  //   await factory.blacklistAddress(deployer.address);
  //   await expect(pair.burn(deployer.address)).to.revertedWith("Address is blacklisted");
  // });

  // it("swap:token0", async () => {
  //   const token0Amount = parseEther("5");
  //   const token1Amount = parseEther("10");
  //   await addLiquidity(token0Amount, token1Amount);

  //   const swapAmount = parseEther("1");
  //   const expectedOutputAmount = ethers.BigNumber.from("1662497915624478906");
  //   await token0.transfer(pair.address, swapAmount);
  //   await expect(pair.swap(0, expectedOutputAmount, deployer.address, "0x", overrides))
  //     .to.emit(token1, "Transfer")
  //     .withArgs(pair.address, deployer.address, expectedOutputAmount)
  //     .to.emit(pair, "Sync")
  //     .withArgs(token0Amount.add(swapAmount), token1Amount.sub(expectedOutputAmount))
  //     .to.emit(pair, "Swap")
  //     .withArgs(deployer.address, swapAmount, 0, 0, expectedOutputAmount, deployer.address);

  //   const reserves = await pair.getReserves();
  //   expect(reserves[0]).to.eq(token0Amount.add(swapAmount));
  //   expect(reserves[1]).to.eq(token1Amount.sub(expectedOutputAmount));
  //   expect(await token0.balanceOf(pair.address)).to.eq(token0Amount.add(swapAmount));
  //   expect(await token1.balanceOf(pair.address)).to.eq(token1Amount.sub(expectedOutputAmount));
  //   const totalSupplyToken0 = await token0.totalSupply();
  //   const totalSupplyToken1 = await token1.totalSupply();
  //   expect(await token0.balanceOf(deployer.address)).to.eq(totalSupplyToken0.sub(token0Amount).sub(swapAmount));
  //   expect(await token1.balanceOf(deployer.address)).to.eq(
  //     totalSupplyToken1.sub(token1Amount).add(expectedOutputAmount),
  //   );
  // });

  // it("swap:token1", async () => {
  //   const token0Amount = parseEther("5");
  //   const token1Amount = parseEther("10");
  //   await addLiquidity(token0Amount, token1Amount);

  //   const swapAmount = parseEther("1");
  //   const expectedOutputAmount = ethers.BigNumber.from("453305446940074565");
  //   await token1.transfer(pair.address, swapAmount);
  //   await expect(pair.swap(expectedOutputAmount, 0, deployer.address, "0x", overrides))
  //     .to.emit(token0, "Transfer")
  //     .withArgs(pair.address, deployer.address, expectedOutputAmount)
  //     .to.emit(pair, "Sync")
  //     .withArgs(token0Amount.sub(expectedOutputAmount), token1Amount.add(swapAmount))
  //     .to.emit(pair, "Swap")
  //     .withArgs(deployer.address, 0, swapAmount, expectedOutputAmount, 0, deployer.address);

  //   const reserves = await pair.getReserves();
  //   expect(reserves[0]).to.eq(token0Amount.sub(expectedOutputAmount));
  //   expect(reserves[1]).to.eq(token1Amount.add(swapAmount));
  //   expect(await token0.balanceOf(pair.address)).to.eq(token0Amount.sub(expectedOutputAmount));
  //   expect(await token1.balanceOf(pair.address)).to.eq(token1Amount.add(swapAmount));
  //   const totalSupplyToken0 = await token0.totalSupply();
  //   const totalSupplyToken1 = await token1.totalSupply();
  //   expect(await token0.balanceOf(deployer.address)).to.eq(
  //     totalSupplyToken0.sub(token0Amount).add(expectedOutputAmount),
  //   );
  //   expect(await token1.balanceOf(deployer.address)).to.eq(totalSupplyToken1.sub(token1Amount).sub(swapAmount));
  // });

  // it("burn", async () => {
  //   const token0Amount = parseEther("3");
  //   const token1Amount = parseEther("3");
  //   await addLiquidity(token0Amount, token1Amount);

  //   const expectedLiquidity = parseEther("3");
  //   await pair.transfer(pair.address, expectedLiquidity.sub(MINIMUM_LIQUIDITY));
  //   await expect(pair.burn(deployer.address, overrides))
  //     .to.emit(pair, "Transfer")
  //     .withArgs(pair.address, zeroAddr, expectedLiquidity.sub(MINIMUM_LIQUIDITY))
  //     .to.emit(token0, "Transfer")
  //     .withArgs(pair.address, deployer.address, token0Amount.sub(1000))
  //     .to.emit(token1, "Transfer")
  //     .withArgs(pair.address, deployer.address, token1Amount.sub(1000))
  //     .to.emit(pair, "Sync")
  //     .withArgs(1000, 1000)
  //     .to.emit(pair, "Burn")
  //     .withArgs(deployer.address, token0Amount.sub(1000), token1Amount.sub(1000), deployer.address);

  //   expect(await pair.balanceOf(deployer.address)).to.eq(0);
  //   expect(await pair.totalSupply()).to.eq(MINIMUM_LIQUIDITY);
  //   expect(await token0.balanceOf(pair.address)).to.eq(1000);
  //   expect(await token1.balanceOf(pair.address)).to.eq(1000);
  //   const totalSupplyToken0 = await token0.totalSupply();
  //   const totalSupplyToken1 = await token1.totalSupply();
  //   expect(await token0.balanceOf(deployer.address)).to.eq(totalSupplyToken0.sub(1000));
  //   expect(await token1.balanceOf(deployer.address)).to.eq(totalSupplyToken1.sub(1000));
  // });

  // const optimisticTestCases: BigNumber[][] = [
  //   ["998000000000000000", 5, 10, 1], // given amountIn, amountOut = floor(amountIn * .998)
  //   ["998000000000000000", 10, 5, 1],
  //   ["998000000000000000", 5, 5, 1],
  //   [1, 5, 5, "1002004008016032065"], // given amountOut, amountIn = ceiling(amountOut / .998)
  // ].map(a => a.map(n => (typeof n === "string" ? ethers.BigNumber.from(n) : parseEther(n.toString()))));
  // optimisticTestCases.forEach((optimisticTestCase, i) => {
  //   it(`optimistic:${i}`, async () => {
  //     const [outputAmount, token0Amount, token1Amount, inputAmount] = optimisticTestCase;
  //     await addLiquidity(token0Amount, token1Amount);
  //     await token0.transfer(pair.address, inputAmount);
  //     await expect(pair.swap(outputAmount.add(1), 0, deployer.address, "0x", overrides)).to.be.revertedWith(
  //       "Safeswap: K",
  //     );
  //     await pair.swap(outputAmount, 0, deployer.address, "0x", overrides);
  //   });
  // });
});
