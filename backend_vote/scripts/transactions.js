import hre from "hardhat";

async function main() {
  const contractAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
  const Vote = await hre.ethers.getContractFactory("Vote");
  const voteAdresse = Vote.attach(contractAddress);

  const [owner, wallet2, wallet3] = await hre.ethers.getSigners();

  // const tx = await voteAdresse.connect(owner).vote(0);
  // await tx.wait();

  const resultat = await voteAdresse.getResults();
  const noms = resultat[0];
  const votes = resultat[1];

  for (let i = 0; i < noms.length; i++) {
    console.log(`${noms[i]} : ${votes[i].toString()} votes`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
