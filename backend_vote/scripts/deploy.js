import hre from "hardhat";

async function main() {
  const Safe = await hre.ethers.getContractFactory("Safe");
  const safeInstance = await Safe.deploy();

  await safeInstance.waitForDeployment();
  const [owner] = await hre.ethers.getSigners();
  const contractAddress = await safeInstance.getAddress();
  console.log("Safe contract deployed at:", contractAddress);
  console.log("Safe deployed to:", owner.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
