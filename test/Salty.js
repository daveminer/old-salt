const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Salty", function () {
  it("should create a keel for the caller", async function () {
    const Salty = await ethers.getContractFactory("Salty");
    const salty = await Salty.deploy();
    await salty.deployed();

    console.log("ONE")

    const [owner, addr1] = await ethers.getSigners();
    const provider = ethers.provider;

    const ownerBalance = await provider.getBalance(owner.address);
    const balbal = await salty.balanceOf(owner.address, salty.WOOD());
    console.log(ownerBalance.toString(), "OWNER");
    console.log(balbal.toString(), "OWNDERRRR")

    const addr1Balance = await provider.getBalance(addr1.address);
    console.log(addr1Balance.toString(), "ADDR1 Balance");

    // Give 10000 wood to addr1
    const wood = await salty.WOOD();
    await salty.safeBatchTransferFrom(
      owner.address,
      addr1.address,
      [wood],
      [10000],
      []
    );

    const balbal2 = await salty.balanceOf(owner.address, salty.WOOD());
    console.log(balbal2.toString(), "OWNDERRRRDONE")

    console.log("AFTER");

    await salty.buildKeel(addr1.address)

    // TODO: this doesn't do anything
    expect(await salty.buildKeel(addr1.address));

    //const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    //await setGreetingTx.wait();

   // expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});

// describe("Greeter", function () {
//   it("Should return the new greeting once it's changed", async function () {
//     const Greeter = await ethers.getContractFactory("Greeter");
//     const greeter = await Greeter.deploy("Hello, world!");
//     await greeter.deployed();

//     expect(await greeter.greet()).to.equal("Hello, world!");

//     const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

//     // wait until the transaction is mined
//     await setGreetingTx.wait();

//     expect(await greeter.greet()).to.equal("Hola, mundo!");
//   });
// });