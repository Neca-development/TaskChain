import { IERC20__factory } from './../typechain-types/factories/@openzeppelin/contracts/token/ERC20/IERC20__factory';
import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { TaskChainPresale__factory} from "../typechain-types";

describe("TaskChainPresaleV2", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  const TOKENS_TO_BUY = 1;
  async function deployOneYearLockFixture() {
 

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();
     
    // DATA FROM SC
    const AVAILABLE_TOKENS = 277091073;

    const whaleUser =  await ethers.getImpersonatedSigner("0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8");
    const tokenHolder =  await ethers.getImpersonatedSigner("0x51423fBA13BbD6114Cc73D998862f210Faa6DCd3");

    const realUserWhoBought =  await ethers.getImpersonatedSigner("0xcf9a2Fa470eFe63199A16A45e6328D7FD10FFAF9");

    const TaskChainPresaleV2 = await ethers.getContractFactory("TaskChainPresaleV2");
    const taskChainPresaleV2 = await TaskChainPresaleV2.connect(whaleUser).deploy("0xdAC17F958D2ee523a2206206994597C13D831ec7","0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419");

    const USDTContract = IERC20__factory.connect("0xdAC17F958D2ee523a2206206994597C13D831ec7", whaleUser);
    const SaleToken = IERC20__factory.connect("0x4C2e29dbc437C4b781963E5B2B393b1D4ea64b19", whaleUser);

    const taskChainPresale =  TaskChainPresale__factory.connect("0x49afa06E429f3Fd5B28Dd2980D673B72eD5dbf28", whaleUser);


    return { SaleToken, taskChainPresaleV2, tokenHolder, AVAILABLE_TOKENS, 
      owner, otherAccount, whaleUser, taskChainPresale, USDTContract, realUserWhoBought };
  }

  describe("Deployment", function () {

    it("Test getAvailable tokens and BuyWithEth", async function () {

      const { taskChainPresaleV2, AVAILABLE_TOKENS, whaleUser, taskChainPresale } = await loadFixture(deployOneYearLockFixture);

      const availbleTokensBeforePurchase = await taskChainPresaleV2.getAvailableTokensInStage();

      expect(availbleTokensBeforePurchase).to.be.eq(AVAILABLE_TOKENS);

      const tokensBoughtBeforePurchase = await taskChainPresaleV2.getBoughtTokensAmount(whaleUser.address);

      expect(tokensBoughtBeforePurchase).to.be.eq(0);

      await taskChainPresaleV2.connect(whaleUser).buyTokenWithETH(TOKENS_TO_BUY, {value:ethers.utils.parseEther('0.05')});

      const availbleTokensAfterPurchase = await taskChainPresaleV2.getAvailableTokensInStage();

      const tokensBoughtAfterPurchase = await taskChainPresaleV2.getBoughtTokensAmount(whaleUser.address);

      expect(availbleTokensAfterPurchase).to.be.eq(AVAILABLE_TOKENS - TOKENS_TO_BUY);

      expect(+tokensBoughtAfterPurchase).to.be.eq(TOKENS_TO_BUY);

    }); 

    it("Test buyWithUSDT and claim", async function () {

      const { taskChainPresaleV2, AVAILABLE_TOKENS, whaleUser, USDTContract, SaleToken, tokenHolder } = await loadFixture(deployOneYearLockFixture);

      const TOKENS_TO_BUY = 1;

      const tokensBoughtBeforePurchase = await taskChainPresaleV2.getBoughtTokensAmount(whaleUser.address);

      expect(tokensBoughtBeforePurchase).to.be.eq(0);

      const usdt_cost = await taskChainPresaleV2.calculateUsdtCost(TOKENS_TO_BUY);

      await USDTContract.approve(taskChainPresaleV2.address, usdt_cost);

      await taskChainPresaleV2.connect(whaleUser).buyTokenWithUSDT(TOKENS_TO_BUY);

      const availbleTokensAfterPurchase = await taskChainPresaleV2.getAvailableTokensInStage();

      const tokensBoughtAfterPurchase = await taskChainPresaleV2.getBoughtTokensAmount(whaleUser.address);

      expect(availbleTokensAfterPurchase).to.be.eq(AVAILABLE_TOKENS - TOKENS_TO_BUY);

      expect(+tokensBoughtAfterPurchase).to.be.eq(TOKENS_TO_BUY);

      const tokenHolderBalance = await SaleToken.balanceOf(tokenHolder.address);

      await taskChainPresaleV2.connect(whaleUser).setTokenHolder(tokenHolder.address);

      await whaleUser.sendTransaction({to:tokenHolder.address, value:ethers.utils.parseEther('0.1')});

      await SaleToken.connect(tokenHolder).approve(taskChainPresaleV2.address, tokenHolderBalance);

      await taskChainPresaleV2.startClaim();

      await taskChainPresaleV2.claimTokens();

      const whaleBalanceAfterClaim = await SaleToken.balanceOf(whaleUser.address);

      expect(whaleBalanceAfterClaim).to.be.eq(ethers.utils.parseEther(TOKENS_TO_BUY.toString()));

    }); 

    it("Check that real users who bough will claim", async function () {

      const { taskChainPresaleV2, AVAILABLE_TOKENS, whaleUser, USDTContract, SaleToken, tokenHolder, realUserWhoBought } = await loadFixture(deployOneYearLockFixture);

      const tokenHolderBalance = await SaleToken.balanceOf(tokenHolder.address);

      await taskChainPresaleV2.connect(whaleUser).setTokenHolder(tokenHolder.address);

      await whaleUser.sendTransaction({to:tokenHolder.address, value:ethers.utils.parseEther('0.1')});

      await SaleToken.connect(tokenHolder).approve(taskChainPresaleV2.address, tokenHolderBalance);

      await taskChainPresaleV2.startClaim();

      await whaleUser.sendTransaction({to:realUserWhoBought.address, value:ethers.utils.parseEther('1')});

      const getTokensBoughtBeforePurchase = await taskChainPresaleV2.getBoughtTokensAmount(realUserWhoBought.address);

      expect(getTokensBoughtBeforePurchase).to.be.eq(2036);

      await taskChainPresaleV2.connect(realUserWhoBought).buyTokenWithETH(1, {value:ethers.utils.parseEther('0.05')});

      const getTokensBought = await taskChainPresaleV2.connect(realUserWhoBought).getBoughtTokensAmount(realUserWhoBought.address);

      await taskChainPresaleV2.connect(realUserWhoBought).claimTokens();

      const saleTokenBalance = await SaleToken.balanceOf(realUserWhoBought.address);
      https://etherscan.io/tx/0x522f670383a68a722a0625b68a2b67840dd235f063793343bcbbad7838f6d072
      expect(saleTokenBalance).to.be.eq(ethers.utils.parseEther(getTokensBought.toString()));

      await taskChainPresaleV2.switchStage();

    }); 

    it("Can't switch before first purchase ", async function () {

      const { taskChainPresaleV2,} = await loadFixture(deployOneYearLockFixture);

      const tx = await taskChainPresaleV2.switchStage().catch((err)=>err);

      expect(tx).to.be.revertedWith("Transfer data from V1");

    }); 


    it("Check getSoldTokensInCurrentStage and switchStage", async function () {

      const { taskChainPresaleV2, taskChainPresale, whaleUser} = await loadFixture(deployOneYearLockFixture);

      const soldTokensInCurrentStage = await taskChainPresaleV2.getSoldTokensInCurrentStage();

      const valueFromV1 = await taskChainPresale.tokensSoldPerStage(0);

      expect(soldTokensInCurrentStage).to.be.eq(valueFromV1);

      await taskChainPresaleV2.connect(whaleUser).buyTokenWithETH(TOKENS_TO_BUY, {value:ethers.utils.parseEther('0.05')});

      const soldTokensInStageAfterPurchase = await taskChainPresaleV2.getSoldTokensInCurrentStage();

      expect(soldTokensInStageAfterPurchase).to.be.eq(valueFromV1.add(1));

      await taskChainPresaleV2.switchStage();
      
      const tokensSoldOnStage2InBegining = await taskChainPresaleV2.getSoldTokensInCurrentStage();

      expect(tokensSoldOnStage2InBegining).to.be.eq(tokensSoldOnStage2InBegining);

      await taskChainPresaleV2.connect(whaleUser).buyTokenWithETH(TOKENS_TO_BUY, {value:ethers.utils.parseEther('0.05')});

      const tokensSoldOnStage2AfterPurchase = await taskChainPresaleV2.getSoldTokensInCurrentStage();

      expect(tokensSoldOnStage2AfterPurchase).to.be.eq(TOKENS_TO_BUY);

    }); 
  });
});
