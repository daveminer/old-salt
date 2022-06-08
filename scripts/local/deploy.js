const fs = require('fs')

// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require('hardhat')

const envFile = '.env.local'
const envFilepath = `client/${envFile}`

const main = async () => {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  await hre.run('compile')

  // Deploy the contract
  const OldSalt = await hre.ethers.getContractFactory('Salty')
  const oldSalt = await OldSalt.deploy()
  await oldSalt.deployed()

  // Get dev accounts
  const accounts = await hre.ethers.getSigners()

  // Seed account with the development player stuff
  await oldSalt.seedPlayerInventory(accounts[0].address)

  console.log('Old Salt deployed to:', oldSalt.address)

  updateContractEnv(oldSalt.address)
}

// Update .env.local with the new contract address for the front end to use
const updateContractEnv = (contractAddress) => {
  // Update the .env.local file if it exists.
  try {
    // This will fail the try block if the file doesn't exist.
    fs.accessSync(envFilepath, fs.constants.W_OK)

    console.log(`Updating ${envFile} with the new contract address...`)

    const envFileContents = fs.readFileSync(envFilepath)

    const newEnvFileContents = envFileContents
      .toString()
      .replace(
        /NEXT_PUBLIC_CONTRACT_ADDRESS=.*/,
        `NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`
      )

    fs.writeFileSync(envFilepath, newEnvFileContents)
  } catch (err) {
    // Create an .env.local file with the contract address.
    console.log(
      `${envFile} not found; creating one with the new contract address...`
    )

    const envFileContents = `NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`

    fs.writeFileSync(envFilepath, envFileContents)

    console.log('Created!')
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
