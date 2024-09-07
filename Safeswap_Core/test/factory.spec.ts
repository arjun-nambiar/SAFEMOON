import { IERC20 } from "../typechain/interfaces/IERC20";
import { Greater__factory, SafeswapFactory, SafeswapPair } from "../typechain";
import { ethers, waffle } from "hardhat";
import { Wallet } from "ethers";
import { fixture } from "./utils/fixture";
import { expect } from "chai";
import { parseEther, parseUnits } from "ethers/lib/utils";

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

  before("create fixture loader", async () => {
    wallets = await (ethers as any).getSigners();
    deployer = wallets[0];
    account1 = wallets[1];
    account2 = wallets[2];
    account3 = wallets[3];
  });

  beforeEach(async () => {
    loadFixture = waffle.createFixtureLoader(wallets as any);
    ({ token0, token1, factory, pair } = await loadFixture(fixture));
  });

  it("deploy and check pair upgradeable", async () => {
    await token0.transfer(pair.address, parseEther("100"));
    await token1.transfer(pair.address, parseEther("100"));
    await pair.mint(deployer.address);

    const oldLpBalance = await pair.balanceOf(deployer.address);

    // upgrade contract
    await factory.deployImplementation();

    const newLpBalance = await pair.balanceOf(deployer.address);

    expect(newLpBalance).to.eq(oldLpBalance);
  });

  it("deploy and check new upgradeable pattern", async () => {
      // deploy contract Greater
      const MockFactory = await ethers.getContractFactory("MockFactory");
      const Greater01 = await ethers.getContractFactory("Greater");
      const Greater02 = await ethers.getContractFactory("NewGreater");

      const mockFactory = await MockFactory.deploy();
      const greater01 = await Greater01.deploy();
      const greater02 = await Greater02.deploy();
      const greater01Ins = await greater01.deployed();
      const greater02Ins = await greater02.deployed();

      // set impl 01
      await expect(mockFactory.createContract()).to.revertedWith("Please set implementation");
      await expect(mockFactory.setImplementation(ethers.constants.AddressZero)).to.revertedWith("Not allow zero address");
      await mockFactory.setImplementation(greater01Ins.address);

      const pairAddress = await mockFactory.callStatic.createContract();
      await mockFactory.createContract();

      const pairIns = await Greater__factory.connect(pairAddress, deployer);
      await pairIns.increase(); // count == 1
      await pairIns.increase(); // count == 2
      await pairIns.decrease(); // count == 1
      await pairIns.doSomethingWithCount(); // count == 6
      await pairIns.setBalance(11, 1000);

      const countValue01 = await pairIns.count();
      expect(countValue01).to.eq(6);
      const balance01 = await pairIns.balance(11);
      expect(balance01).to.eq(1000);

       // set impl 02
      await mockFactory.setImplementation(greater02Ins.address);
      await pairIns.setBalance(12, 1001);
      await pairIns.decrease(); // count == 5
      await pairIns.doSomethingWithCount(); // count == 15

      const countValue02 = await pairIns.count();
      expect(countValue02).to.eq(15);
      const balance02 = await pairIns.balance(11);
      expect(balance02).to.eq(1000);
      const balance03 = await pairIns.balance(12);
      expect(balance03).to.eq(1001);
  });

  // it("approve partner", async () => {
  //   expect(await factory.approvePartnerStatus(account1.address)).to.eq(false);
  //   await factory.approveLiquidityPartner(account1.address);
  //   expect(await factory.approvePartnerStatus(account1.address)).to.eq(true);
  //   await factory.unApproveLiquidityPartner(account1.address);
  //   expect(await factory.approvePartnerStatus(account1.address)).to.eq(false);
  // });

  // it("blacklist token", async () => {
  //   expect(await factory.isBlacklistedToken(token0.address)).to.eq(false);
  //   await factory.blacklistTokenAddress(token0.address);
  //   expect(await factory.isBlacklistedToken(token0.address)).to.eq(true);
  //   await factory.whitelistTokenAddress(token0.address);
  //   expect(await factory.isBlacklistedToken(token0.address)).to.eq(false);
  // });

  // it("blacklist address", async () => {
  //   expect(await factory.isBlacklistedStatus(account1.address)).to.eq(false);
  //   await factory.blacklistAddress(account1.address);
  //   expect(await factory.isBlacklistedStatus(account1.address)).to.eq(true);
  // });

  // it("create pair - unapproved partner", async () => {
  //   await expect(factory.createPair(token0.address, token1.address, account1.address)).to.revertedWith(
  //     "Not approved the partner",
  //   );
  // });

  // it("create pair with whitelisted token", async () => {
  //   await factory.approveLiquidityPartner(deployer.address);
  //   expect(await factory.approvePartnerStatus(deployer.address)).to.eq(true);

  //   await expect(factory.createPair(token0.address, token1.address, deployer.address)).to.not.reverted;
  // });

  // it("create pair with blacklisted token - token A", async () => {
  //   await factory.blacklistTokenAddress(token0.address);
  //   expect(await factory.isBlacklistedToken(token0.address)).to.eq(true);

  //   await expect(factory.createPair(token0.address, token1.address, deployer.address)).to.revertedWith(
  //     "Cannot create with tokenA",
  //   );
  // });

  // it("create pair with blacklisted token - token B", async () => {
  //   await factory.blacklistTokenAddress(token1.address);
  //   expect(await factory.isBlacklistedToken(token1.address)).to.eq(true);

  //   await expect(factory.createPair(token0.address, token1.address, deployer.address)).to.revertedWith(
  //     "Cannot create with tokenB",
  //   );
  // });
});
