import hre from "hardhat";

async function main() {
  const Vote = await hre.ethers.getContractFactory("Vote");
  const voteInstance = await Vote.deploy(["Alice", "Bob", "Henri"]);

  await voteInstance.waitForDeployment();
  const [owner] = await hre.ethers.getSigners();
  console.log("Deploying contract with address:", owner.address);

  const contractAddress = await voteInstance.getAddress();
  console.log(`✅ Contract deployed at: ${contractAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
