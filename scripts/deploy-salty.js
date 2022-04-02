// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  await hre.run("compile");

  // We get the contract to deploy
  const OldSalt = await hre.ethers.getContractFactory("Salty");
  const oldSalt = await OldSalt.deploy();

  await oldSalt.deployed();

  // Replace this with the player (non-contract-owner) wallet
  await oldSalt.seedPlayerInventory(
    "0x598aD9cA8F77815C1A1b0eABEBeB26859d1828A3"
  );

  console.log("Old Salt deployed to:", oldSalt.address);
  console.log("Put this address into the CONTRACT_ADDRESS env var.");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
