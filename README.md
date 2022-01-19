# Old Salt

## Setting up the dev environment

The instructions for setting up the project are largely derived from the [Hardhat Network docs](https://hardhat.org/hardhat-network/)


### Manual setup

How to run the dev environment via Linux/OSX terminals

#### Deploying the contract

In one console and from the project root, start a standalone network:

`npx hardhat node`

From a new console and in the project root:
```
// Start a Hardhat Network console to localhost
npx hardhat console --network localhost

// Get the contract factory
const Salty = await ethers.getContractFactory("Salty");

// Attach the contract to the account
const salty = Salty.attach("0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199");

// Call a contract function
await salty.buildKeel("0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199");
```

Congratulations, you did stuff!

## Miscellaneous

If Hardhat script doesn't trigger output in the node, try:
```
npx hardhat run --network localhost scripts/deploy-salty.js
```

This project is based on Hardhat, which can run these tasks (among others):

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```
