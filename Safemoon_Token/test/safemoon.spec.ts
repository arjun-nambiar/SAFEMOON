import { Wallet } from "ethers";
import { ethers, waffle } from "hardhat";
import { fixture } from "./utils/fixture";
import { ISafemoon, OldSafemoon, Safemoon } from "../typechain";
import { expect } from "chai";
import { beautifyObject } from "./utils/utils";
import { parseEther, parseUnits } from "ethers/lib/utils";

describe("Safemoon", () => {
  let wallets: Wallet[];
  let deployer: Wallet;
  let account1: Wallet;
  let account2: Wallet;
  let account3: Wallet;
  let safemoon: ISafemoon & Safemoon;
  let oldSafemoon: ISafemoon & OldSafemoon;
  let loadFixture: ReturnType<typeof waffle.createFixtureLoader>;
  const zeroAddr = ethers.constants.AddressZero;

  before("create fixture loader", async () => {
    wallets = await (ethers as any).getSigners();
    deployer = wallets[0];
    account1 = wallets[1];
    account2 = wallets[2];
    account3 = wallets[3];
  });

  beforeEach(async () => {
    loadFixture = waffle.createFixtureLoader(wallets as any);
    ({ safemoon, oldSafemoon } = await loadFixture(fixture));

    for (let i = 0; i < 20; i++) {
      const wallet = ethers.Wallet.createRandom().address;
      if (![deployer.address, account1.address, account2.address].includes(wallet)) {
        await safemoon.excludeFromReward(wallet);
        await oldSafemoon.excludeFromReward(wallet);
      }
    }
  });

  const printBalanceOfAddress = async (safemoonInstance: ISafemoon, address: string) => {
    console.log("\x1b[36m%s\x1b[0m", "============= START printBalanceOfAddress =============");
    console.log("\x1b[36m%s\x1b[0m", "address", address);

    const balance = await safemoonInstance.balanceOf(address);
    console.log("\x1b[36m%s\x1b[0m", "balance", ethers.utils.formatEther(balance), "ethers");

    console.log("\x1b[36m%s\x1b[0m", "============= STOP printBalanceOfAddress =============");
  };

  const percentOptimize = (int1: number, int2: number): string => {
    return "=============> Optimize " + (1 - int1 / int2) * 100 + "% gas than for old";
  };

  it("transfer from exclude to non-exclude wallet", async () => {
    // add deployer to exclude
    await safemoon.excludeFromReward(deployer.address);
    await oldSafemoon.excludeFromReward(deployer.address);

    const acc1SFMBalance = await safemoon.balanceOf(account1.address);
    const acc1OldSFMBalance = await oldSafemoon.balanceOf(account1.address);
    const zeroSFMBalance = await safemoon.balanceOf(zeroAddr);
    const zeroOldSFMBalance = await oldSafemoon.balanceOf(zeroAddr);
    expect(zeroSFMBalance).eq(zeroOldSFMBalance);
    expect(acc1SFMBalance).eq(0);
    expect(acc1OldSFMBalance).eq(0);

    // est gas limit
    const gasLimit = await safemoon.estimateGas.transfer(account1.address, parseEther("10"));
    const oldGasLimit = await oldSafemoon.estimateGas.transfer(account1.address, parseEther("10"));
    console.log("\x1b[36m%s\x1b[0m", "gasLimit", gasLimit.toString());
    console.log("\x1b[36m%s\x1b[0m", "oldGasLimit", oldGasLimit.toString());
    console.log(
      "\x1b[36m%s\x1b[0m",
      "Transfer from exclude to non-exclude wallet",
      percentOptimize(gasLimit.toNumber(), oldGasLimit.toNumber()),
    );

    await safemoon.transfer(account1.address, parseEther("10"));
    await oldSafemoon.transfer(account1.address, parseEther("10"));
    const acc1SFMBalance01 = await safemoon.balanceOf(account1.address);
    const acc1OldSFMBalance01 = await oldSafemoon.balanceOf(account1.address);
    const deployerSFMBalance01 = await safemoon.balanceOf(deployer.address);
    const deployerOldSFMBalance01 = await oldSafemoon.balanceOf(deployer.address);

    expect(acc1OldSFMBalance01).eq(acc1SFMBalance01);
    expect(deployerSFMBalance01).eq(deployerOldSFMBalance01);

    const zeroSFMBalance01 = await safemoon.balanceOf(zeroAddr);
    const zeroOldSFMBalance01 = await oldSafemoon.balanceOf(zeroAddr);
    expect(zeroSFMBalance01).eq(zeroOldSFMBalance01);
  });

  it("transfer from non-exclude to non-exclude wallet", async () => {
    // ensure both account is non-exclude
    const isExcludeSFMWith0 = await safemoon.isExcludedFromReward(deployer.address);
    const isExcludeSFMWith1 = await safemoon.isExcludedFromReward(account1.address);

    const isExcludeOldSFMWith0 = await oldSafemoon.isExcludedFromReward(deployer.address);
    const isExcludeOldSFMWith1 = await oldSafemoon.isExcludedFromReward(account1.address);

    expect(isExcludeSFMWith0).eq(false);
    expect(isExcludeSFMWith1).eq(false);
    expect(isExcludeOldSFMWith0).eq(false);
    expect(isExcludeOldSFMWith1).eq(false);

    const acc1SFMBalance = await safemoon.balanceOf(account1.address);
    const acc1OldSFMBalance = await oldSafemoon.balanceOf(account1.address);
    const zeroSFMBalance = await safemoon.balanceOf(zeroAddr);
    const zeroOldSFMBalance = await oldSafemoon.balanceOf(zeroAddr);
    expect(zeroSFMBalance).eq(zeroOldSFMBalance);
    expect(acc1SFMBalance).eq(0);
    expect(acc1OldSFMBalance).eq(0);

    // est gas limit
    const gasLimit = await safemoon.estimateGas.transfer(account1.address, parseEther("10"));
    const oldGasLimit = await oldSafemoon.estimateGas.transfer(account1.address, parseEther("10"));
    console.log("\x1b[36m%s\x1b[0m", "gasLimit", gasLimit.toString());
    console.log("\x1b[36m%s\x1b[0m", "oldGasLimit", oldGasLimit.toString());
    console.log(
      "\x1b[36m%s\x1b[0m",
      "Transfer from non-exclude to non-exclude wallet",
      percentOptimize(gasLimit.toNumber(), oldGasLimit.toNumber()),
    );

    await safemoon.transfer(account1.address, parseEther("10"));
    await oldSafemoon.transfer(account1.address, parseEther("10"));
    const acc1SFMBalance01 = await safemoon.balanceOf(account1.address);
    const acc1OldSFMBalance01 = await oldSafemoon.balanceOf(account1.address);
    const deployerSFMBalance01 = await safemoon.balanceOf(deployer.address);
    const deployerOldSFMBalance01 = await oldSafemoon.balanceOf(deployer.address);

    expect(acc1OldSFMBalance01).eq(acc1SFMBalance01);
    expect(deployerSFMBalance01).eq(deployerOldSFMBalance01);

    const zeroSFMBalance01 = await safemoon.balanceOf(zeroAddr);
    const zeroOldSFMBalance01 = await oldSafemoon.balanceOf(zeroAddr);
    expect(zeroSFMBalance01).eq(zeroOldSFMBalance01);
  });

  it("transfer from non-exclude to exclude wallet", async () => {
    // add deployer to exclude
    await safemoon.excludeFromReward(account1.address);
    await oldSafemoon.excludeFromReward(account1.address);

    const acc1SFMBalance = await safemoon.balanceOf(account1.address);
    const acc1OldSFMBalance = await oldSafemoon.balanceOf(account1.address);
    const zeroSFMBalance = await safemoon.balanceOf(zeroAddr);
    const zeroOldSFMBalance = await oldSafemoon.balanceOf(zeroAddr);
    expect(zeroSFMBalance).eq(zeroOldSFMBalance);
    expect(acc1SFMBalance).eq(0);
    expect(acc1OldSFMBalance).eq(0);

    // est gas limit
    const gasLimit = await safemoon.estimateGas.transfer(account1.address, parseEther("10"));
    const oldGasLimit = await oldSafemoon.estimateGas.transfer(account1.address, parseEther("10"));
    console.log("\x1b[36m%s\x1b[0m", "gasLimit", gasLimit.toString());
    console.log("\x1b[36m%s\x1b[0m", "oldGasLimit", oldGasLimit.toString());
    console.log(
      "\x1b[36m%s\x1b[0m",
      "Transfer from non-exclude to exclude wallet: ",
      percentOptimize(gasLimit.toNumber(), oldGasLimit.toNumber()),
    );

    await safemoon.transfer(account1.address, parseEther("10"));
    await oldSafemoon.transfer(account1.address, parseEther("10"));
    const acc1SFMBalance01 = await safemoon.balanceOf(account1.address);
    const acc1OldSFMBalance01 = await oldSafemoon.balanceOf(account1.address);
    const deployerSFMBalance01 = await safemoon.balanceOf(deployer.address);
    const deployerOldSFMBalance01 = await oldSafemoon.balanceOf(deployer.address);

    expect(acc1OldSFMBalance01).eq(acc1SFMBalance01);
    expect(deployerSFMBalance01).eq(deployerOldSFMBalance01);

    const zeroSFMBalance01 = await safemoon.balanceOf(zeroAddr);
    const zeroOldSFMBalance01 = await oldSafemoon.balanceOf(zeroAddr);
    expect(zeroSFMBalance01).eq(zeroOldSFMBalance01);
  });

  it("transfer from exclude to exclude wallet", async () => {
    // add deployer to exclude
    await safemoon.excludeFromReward(account1.address);
    await oldSafemoon.excludeFromReward(account1.address);
    await safemoon.excludeFromReward(account2.address);
    await oldSafemoon.excludeFromReward(account2.address);

    await safemoon.transfer(account2.address, parseEther("100"));
    await oldSafemoon.transfer(account2.address, parseEther("100"));

    const acc1SFMBalance = await safemoon.balanceOf(account1.address);
    const acc1OldSFMBalance = await oldSafemoon.balanceOf(account1.address);
    const zeroSFMBalance = await safemoon.balanceOf(zeroAddr);
    const zeroOldSFMBalance = await oldSafemoon.balanceOf(zeroAddr);
    expect(zeroSFMBalance).eq(zeroOldSFMBalance);
    expect(acc1SFMBalance).eq(0);
    expect(acc1OldSFMBalance).eq(0);

    // est gas limit
    const gasLimit = await safemoon.estimateGas.transfer(account1.address, parseEther("10"));
    const oldGasLimit = await oldSafemoon.estimateGas.transfer(account1.address, parseEther("10"));
    console.log("\x1b[36m%s\x1b[0m", "gasLimit", gasLimit.toString());
    console.log("\x1b[36m%s\x1b[0m", "oldGasLimit", oldGasLimit.toString());
    console.log(
      "\x1b[36m%s\x1b[0m",
      "Transfer from exclude to exclude wallet: ",
      percentOptimize(gasLimit.toNumber(), oldGasLimit.toNumber()),
    );

    await safemoon.transfer(account1.address, parseEther("10"));
    await oldSafemoon.transfer(account1.address, parseEther("10"));
    const acc1SFMBalance01 = await safemoon.balanceOf(account1.address);
    const acc1OldSFMBalance01 = await oldSafemoon.balanceOf(account1.address);
    const account2SFMBalance01 = await safemoon.balanceOf(account2.address);
    const account2OldSFMBalance01 = await oldSafemoon.balanceOf(account2.address);

    expect(acc1OldSFMBalance01).eq(acc1SFMBalance01);
    expect(account2SFMBalance01).eq(account2OldSFMBalance01);

    const zeroSFMBalance01 = await safemoon.balanceOf(zeroAddr);
    const zeroOldSFMBalance01 = await oldSafemoon.balanceOf(zeroAddr);
    expect(zeroSFMBalance01).eq(zeroOldSFMBalance01);
  });

  it("transferFrom from exclude to non-exclude wallet", async () => {
    await safemoon.approve(account2.address, ethers.constants.MaxUint256);
    await oldSafemoon.approve(account2.address, ethers.constants.MaxUint256);

    // add deployer to exclude
    await safemoon.excludeFromReward(deployer.address);
    await oldSafemoon.excludeFromReward(deployer.address);

    const acc1SFMBalance = await safemoon.balanceOf(account1.address);
    const acc1OldSFMBalance = await oldSafemoon.balanceOf(account1.address);
    const zeroSFMBalance = await safemoon.balanceOf(zeroAddr);
    const zeroOldSFMBalance = await oldSafemoon.balanceOf(zeroAddr);
    expect(zeroSFMBalance).eq(zeroOldSFMBalance);
    expect(acc1SFMBalance).eq(0);
    expect(acc1OldSFMBalance).eq(0);

    // est gas limit
    const gasLimit = await safemoon
      .connect(account2)
      .estimateGas.transferFrom(deployer.address, account1.address, parseEther("10"));
    const oldGasLimit = await oldSafemoon
      .connect(account2)
      .estimateGas.transferFrom(deployer.address, account1.address, parseEther("10"));
    console.log("\x1b[36m%s\x1b[0m", "gasLimit", gasLimit.toString());
    console.log("\x1b[36m%s\x1b[0m", "oldGasLimit", oldGasLimit.toString());
    console.log(
      "\x1b[36m%s\x1b[0m",
      "TransferFrom from exclude to non-exclude wallet",
      percentOptimize(gasLimit.toNumber(), oldGasLimit.toNumber()),
    );

    await safemoon.connect(account2).transferFrom(deployer.address, account1.address, parseEther("10"));
    await oldSafemoon.connect(account2).transferFrom(deployer.address, account1.address, parseEther("10"));
    const acc1SFMBalance01 = await safemoon.balanceOf(account1.address);
    const acc1OldSFMBalance01 = await oldSafemoon.balanceOf(account1.address);
    const deployerSFMBalance01 = await safemoon.balanceOf(deployer.address);
    const deployerOldSFMBalance01 = await oldSafemoon.balanceOf(deployer.address);
    const acc2SFMBalance01 = await safemoon.balanceOf(deployer.address);
    const acc2OldSFMBalance01 = await oldSafemoon.balanceOf(deployer.address);

    expect(acc2SFMBalance01).eq(acc2OldSFMBalance01);
    expect(acc1OldSFMBalance01).eq(acc1SFMBalance01);
    expect(deployerSFMBalance01).eq(deployerOldSFMBalance01);

    const zeroSFMBalance01 = await safemoon.balanceOf(zeroAddr);
    const zeroOldSFMBalance01 = await oldSafemoon.balanceOf(zeroAddr);
    expect(zeroSFMBalance01).eq(zeroOldSFMBalance01);
  });

  it("transferFrom from non-exclude to non-exclude wallet", async () => {
    await safemoon.approve(account2.address, ethers.constants.MaxUint256);
    await oldSafemoon.approve(account2.address, ethers.constants.MaxUint256);

    // ensure both account is non-exclude
    const isExcludeSFMWith0 = await safemoon.isExcludedFromReward(deployer.address);
    const isExcludeSFMWith1 = await safemoon.isExcludedFromReward(account1.address);

    const isExcludeOldSFMWith0 = await oldSafemoon.isExcludedFromReward(deployer.address);
    const isExcludeOldSFMWith1 = await oldSafemoon.isExcludedFromReward(account1.address);

    expect(isExcludeSFMWith0).eq(false);
    expect(isExcludeSFMWith1).eq(false);
    expect(isExcludeOldSFMWith0).eq(false);
    expect(isExcludeOldSFMWith1).eq(false);

    const acc1SFMBalance = await safemoon.balanceOf(account1.address);
    const acc1OldSFMBalance = await oldSafemoon.balanceOf(account1.address);
    const zeroSFMBalance = await safemoon.balanceOf(zeroAddr);
    const zeroOldSFMBalance = await oldSafemoon.balanceOf(zeroAddr);
    expect(zeroSFMBalance).eq(zeroOldSFMBalance);
    expect(acc1SFMBalance).eq(0);
    expect(acc1OldSFMBalance).eq(0);

    // est gas limit
    const gasLimit = await safemoon
      .connect(account2)
      .estimateGas.transferFrom(deployer.address, account1.address, parseEther("10"));
    const oldGasLimit = await oldSafemoon
      .connect(account2)
      .estimateGas.transferFrom(deployer.address, account1.address, parseEther("10"));
    console.log("\x1b[36m%s\x1b[0m", "gasLimit", gasLimit.toString());
    console.log("\x1b[36m%s\x1b[0m", "oldGasLimit", oldGasLimit.toString());
    console.log(
      "\x1b[36m%s\x1b[0m",
      "TransferFrom from non-exclude to non-exclude wallet",
      percentOptimize(gasLimit.toNumber(), oldGasLimit.toNumber()),
    );

    await safemoon.connect(account2).transferFrom(deployer.address, account1.address, parseEther("10"));
    await oldSafemoon.connect(account2).transferFrom(deployer.address, account1.address, parseEther("10"));
    const acc1SFMBalance01 = await safemoon.balanceOf(account1.address);
    const acc1OldSFMBalance01 = await oldSafemoon.balanceOf(account1.address);
    const deployerSFMBalance01 = await safemoon.balanceOf(deployer.address);
    const deployerOldSFMBalance01 = await oldSafemoon.balanceOf(deployer.address);
    const acc2SFMBalance01 = await safemoon.balanceOf(deployer.address);
    const acc2OldSFMBalance01 = await oldSafemoon.balanceOf(deployer.address);

    expect(acc2SFMBalance01).eq(acc2OldSFMBalance01);
    expect(acc1OldSFMBalance01).eq(acc1SFMBalance01);
    expect(deployerSFMBalance01).eq(deployerOldSFMBalance01);

    const zeroSFMBalance01 = await safemoon.balanceOf(zeroAddr);
    const zeroOldSFMBalance01 = await oldSafemoon.balanceOf(zeroAddr);
    expect(zeroSFMBalance01).eq(zeroOldSFMBalance01);
  });

  it("transferFrom from non-exclude to exclude wallet", async () => {
    await safemoon.approve(account2.address, ethers.constants.MaxUint256);
    await oldSafemoon.approve(account2.address, ethers.constants.MaxUint256);
    // add deployer to exclude
    await safemoon.excludeFromReward(account1.address);
    await oldSafemoon.excludeFromReward(account1.address);

    const acc1SFMBalance = await safemoon.balanceOf(account1.address);
    const acc1OldSFMBalance = await oldSafemoon.balanceOf(account1.address);
    const zeroSFMBalance = await safemoon.balanceOf(zeroAddr);
    const zeroOldSFMBalance = await oldSafemoon.balanceOf(zeroAddr);
    expect(zeroSFMBalance).eq(zeroOldSFMBalance);
    expect(acc1SFMBalance).eq(0);
    expect(acc1OldSFMBalance).eq(0);

    // est gas limit
    const gasLimit = await safemoon
      .connect(account2)
      .estimateGas.transferFrom(deployer.address, account1.address, parseEther("10"));
    const oldGasLimit = await oldSafemoon
      .connect(account2)
      .estimateGas.transferFrom(deployer.address, account1.address, parseEther("10"));
    console.log("\x1b[36m%s\x1b[0m", "gasLimit", gasLimit.toString());
    console.log("\x1b[36m%s\x1b[0m", "oldGasLimit", oldGasLimit.toString());
    console.log(
      "\x1b[36m%s\x1b[0m",
      "TransferFrom from non-exclude to exclude wallet",
      percentOptimize(gasLimit.toNumber(), oldGasLimit.toNumber()),
    );

    await safemoon.connect(account2).transferFrom(deployer.address, account1.address, parseEther("10"));
    await oldSafemoon.connect(account2).transferFrom(deployer.address, account1.address, parseEther("10"));
    const acc1SFMBalance01 = await safemoon.balanceOf(account1.address);
    const acc1OldSFMBalance01 = await oldSafemoon.balanceOf(account1.address);
    const deployerSFMBalance01 = await safemoon.balanceOf(deployer.address);
    const deployerOldSFMBalance01 = await oldSafemoon.balanceOf(deployer.address);
    const acc2SFMBalance01 = await safemoon.balanceOf(account2.address);
    const acc2OldSFMBalance01 = await oldSafemoon.balanceOf(account2.address);

    expect(acc2SFMBalance01).eq(acc2OldSFMBalance01);
    expect(acc1OldSFMBalance01).eq(acc1SFMBalance01);
    expect(deployerSFMBalance01).eq(deployerOldSFMBalance01);

    const zeroSFMBalance01 = await safemoon.balanceOf(zeroAddr);
    const zeroOldSFMBalance01 = await oldSafemoon.balanceOf(zeroAddr);
    expect(zeroSFMBalance01).eq(zeroOldSFMBalance01);
  });

  it("transferFrom from exclude to exclude wallet", async () => {
    await safemoon.connect(account2).approve(account3.address, ethers.constants.MaxUint256);
    await oldSafemoon.connect(account2).approve(account3.address, ethers.constants.MaxUint256);
    // add deployer to exclude
    await safemoon.transfer(account2.address, parseUnits("200", 9));
    await oldSafemoon.transfer(account2.address, parseUnits("200", 9));
    await safemoon.excludeFromReward(account1.address);
    await oldSafemoon.excludeFromReward(account1.address);
    await safemoon.excludeFromReward(account2.address);
    await oldSafemoon.excludeFromReward(account2.address);

    const acc1SFMBalance = await safemoon.balanceOf(account1.address);
    const acc1OldSFMBalance = await oldSafemoon.balanceOf(account1.address);
    const zeroSFMBalance = await safemoon.balanceOf(zeroAddr);
    const zeroOldSFMBalance = await oldSafemoon.balanceOf(zeroAddr);
    expect(zeroSFMBalance).eq(zeroOldSFMBalance);
    expect(acc1SFMBalance).eq(0);
    expect(acc1OldSFMBalance).eq(0);

    // est gas limit
    const gasLimit = await safemoon
      .connect(account3)
      .estimateGas.transferFrom(account2.address, account1.address, parseUnits("10", 9));
    const oldGasLimit = await oldSafemoon
      .connect(account3)
      .estimateGas.transferFrom(account2.address, account1.address, parseUnits("10", 9));
    console.log("\x1b[36m%s\x1b[0m", "gasLimit", gasLimit.toString());
    console.log("\x1b[36m%s\x1b[0m", "oldGasLimit", oldGasLimit.toString());
    console.log(
      "\x1b[36m%s\x1b[0m",
      "TransferFrom from exclude to exclude wallet",
      percentOptimize(gasLimit.toNumber(), oldGasLimit.toNumber()),
    );
    await safemoon.connect(account3).transferFrom(account2.address, account1.address, parseUnits("10", 9));
    await oldSafemoon.connect(account3).transferFrom(account2.address, account1.address, parseUnits("10", 9));

    await safemoon.transfer(wallets[5].address, parseUnits("20", 9));
    await oldSafemoon.transfer(wallets[5].address, parseUnits("20", 9));
    await safemoon.excludeFromReward(wallets[5].address);
    await oldSafemoon.excludeFromReward(wallets[5].address);

    await safemoon.connect(account3).transferFrom(account2.address, account1.address, parseUnits("100", 9));
    await oldSafemoon.connect(account3).transferFrom(account2.address, account1.address, parseUnits("100", 9));
    const acc1SFMBalance01 = await safemoon.balanceOf(account1.address);
    const acc1OldSFMBalance01 = await oldSafemoon.balanceOf(account1.address);
    const deployerSFMBalance01 = await safemoon.balanceOf(deployer.address);
    const deployerOldSFMBalance01 = await oldSafemoon.balanceOf(deployer.address);
    const acc2SFMBalance01 = await safemoon.balanceOf(account2.address);
    const acc2OldSFMBalance01 = await oldSafemoon.balanceOf(account2.address);

    expect(acc2SFMBalance01).eq(acc2OldSFMBalance01);
    expect(acc1OldSFMBalance01).eq(acc1SFMBalance01);
    expect(deployerSFMBalance01).eq(deployerOldSFMBalance01);

    const zeroSFMBalance01 = await safemoon.balanceOf(zeroAddr);
    const zeroOldSFMBalance01 = await oldSafemoon.balanceOf(zeroAddr);
    expect(zeroSFMBalance01).eq(zeroOldSFMBalance01);
  });

  it("transferFrom from exclude to exclude wallet v2", async () => {
    const balance = await safemoon.balanceOf(deployer.address);
    await safemoon.transfer(account2.address, balance);
    await oldSafemoon.transfer(account2.address, balance);
    await safemoon.connect(account2).transfer(deployer.address, balance);
    await oldSafemoon.connect(account2).transfer(deployer.address, balance);
    await safemoon.connect(account2).approve(account3.address, ethers.constants.MaxUint256);
    await oldSafemoon.connect(account2).approve(account3.address, ethers.constants.MaxUint256);
    // add deployer to exclude
    await safemoon.transfer(account2.address, parseUnits("200", 9));
    await oldSafemoon.transfer(account2.address, parseUnits("200", 9));
    await safemoon.excludeFromReward(account1.address);
    await oldSafemoon.excludeFromReward(account1.address);
    await safemoon.excludeFromReward(account2.address);
    await oldSafemoon.excludeFromReward(account2.address);

    const acc1SFMBalance = await safemoon.balanceOf(account1.address);
    const acc1OldSFMBalance = await oldSafemoon.balanceOf(account1.address);
    const zeroSFMBalance = await safemoon.balanceOf(zeroAddr);
    const zeroOldSFMBalance = await oldSafemoon.balanceOf(zeroAddr);
    expect(zeroSFMBalance).eq(zeroOldSFMBalance);
    expect(acc1SFMBalance).eq(0);
    expect(acc1OldSFMBalance).eq(0);

    // est gas limit
    const gasLimit = await safemoon
      .connect(account3)
      .estimateGas.transferFrom(account2.address, account1.address, parseUnits("10", 9));
    const oldGasLimit = await oldSafemoon
      .connect(account3)
      .estimateGas.transferFrom(account2.address, account1.address, parseUnits("10", 9));
    console.log("\x1b[36m%s\x1b[0m", "gasLimit", gasLimit.toString());
    console.log("\x1b[36m%s\x1b[0m", "oldGasLimit", oldGasLimit.toString());
    console.log(
      "\x1b[36m%s\x1b[0m",
      "TransferFrom from exclude to exclude wallet 2",
      percentOptimize(gasLimit.toNumber(), oldGasLimit.toNumber()),
    );
    await safemoon.connect(account3).transferFrom(account2.address, account1.address, parseUnits("10", 9));
    await oldSafemoon.connect(account3).transferFrom(account2.address, account1.address, parseUnits("10", 9));

    await safemoon.transfer(wallets[5].address, parseUnits("20", 9));
    await oldSafemoon.transfer(wallets[5].address, parseUnits("20", 9));
    await safemoon.excludeFromReward(wallets[5].address);
    await oldSafemoon.excludeFromReward(wallets[5].address);

    await safemoon.connect(account3).transferFrom(account2.address, account1.address, parseUnits("100", 9));
    await oldSafemoon.connect(account3).transferFrom(account2.address, account1.address, parseUnits("100", 9));
    const acc1SFMBalance01 = await safemoon.balanceOf(account1.address);
    const acc1OldSFMBalance01 = await oldSafemoon.balanceOf(account1.address);
    const deployerSFMBalance01 = await safemoon.balanceOf(deployer.address);
    const deployerOldSFMBalance01 = await oldSafemoon.balanceOf(deployer.address);
    const acc2SFMBalance01 = await safemoon.balanceOf(account2.address);
    const acc2OldSFMBalance01 = await oldSafemoon.balanceOf(account2.address);

    expect(acc2SFMBalance01).eq(acc2OldSFMBalance01);
    expect(acc1OldSFMBalance01).eq(acc1SFMBalance01);
    expect(deployerSFMBalance01).eq(deployerOldSFMBalance01);

    const zeroSFMBalance01 = await safemoon.balanceOf(zeroAddr);
    const zeroOldSFMBalance01 = await oldSafemoon.balanceOf(zeroAddr);
    expect(zeroSFMBalance01).eq(zeroOldSFMBalance01);
  });
});
