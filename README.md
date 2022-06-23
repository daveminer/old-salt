# Old Salt

## Setting up the dev environment

This is a [Hardhat](https://hardhat.org/hardhat-network/) dApp with a [NextJS](https://nextjs.org/) front end (/client).

A Makefile is included that provides the commands need to start the development environment via the following steps.

### Native dev environment

This method requires two terminals:

- one for the local blockchain
- one for running deployment scripts and the front end web server.

#### Start the local blockchain

In the first terminal, run `make chain`. This will start a local instance of [Hardhat Network](https://hardhat.org/tutorial/debugging-with-hardhat-network#_6-debugging-with-hardhat-network) and display the test account addresses _(these addresses persist through restarts)_

#### Deploy the contract

_Note: This step will write to the **client/.env.local** file._

Open another terminal at the project root and run `make contract`. This command will deploy the contract, seed the development
player accounts with game resources, and write the new contract address to the **client/.env.local** file (or create
it if it doesn't exist).

#### Start the front end web server

From the deployment terminal (or yet a new terminal if preferred): `make game`

### Docker Compose Dev Environment

From the project root:
```
docker-compose build
docker-compose up
```

...then load `http://localhost:3000` in a browser.

### Set up Metamask

_Under construction_

## How to play

You should have some starting resources (wood): this can be used to create ships.

### What's on the current roadmap?

- Reorganization of all the source code
- Add add stats to ships based on RNG and user input at creation time
- Support location for ships
- Support ships in ports/locations (static or dynamic?)
