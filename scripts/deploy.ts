import { ethers } from "hardhat";
import { verifyContract } from "../utils/helpers";

async function main() {

  const usdc = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
  const oracle = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419"

  const TaskChainPresaleV2 = await ethers.getContractFactory("TaskChainPresaleV2");
  const taskChainPresaleV2 = await TaskChainPresaleV2.deploy(usdc, oracle);

  await taskChainPresaleV2.deployed();

  console.log('TaskChainV2 was deployed to ', taskChainPresaleV2.address);

  await verifyContract(taskChainPresaleV2.address, usdc, oracle);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
