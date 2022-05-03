import { ethers } from "ethers";
import React, { useEffect, useState } from "react";

import Salty from "../../artifacts/contracts/Salty.sol/Salty.json"

interface EthereumContextInterface {
  //approveAll: Function,
  buildShip: Function,
  //checkApproval: Function,
  connectWallet: Function,
  contract: ethers.Contract | undefined,
  currentAccount: string | undefined,
  disconnectWallet: Function,
  embark: Function,
  ships: Function,
  userInventory: Function
}

interface BuildShipInput {
  tar: Number,
  wood: Number
}

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export const EthereumContext =
  React.createContext<EthereumContextInterface>({} as EthereumContextInterface);

export const EthereumProvider = ({ children }: any) => {
  const [contract, setContract] = useState<any>();
  const [ethereum, setEthereum] = useState<any>();
  const [currentAccount, setCurrentAccount] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (window.ethereum === undefined) return;
    if (contractAddress === undefined) {
      console.error("CONTRACT_ADDRESS is undefined.");
      return;
    }

    if (contract === undefined) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const filter = {}
      // provider.on(filter, (log, event) => {
      //   console.log(log, "CHAIN EVENT LOG");
      //   console.info(event, "CHAIN EVENT");
      // })

      const contract = new ethers.Contract(contractAddress, Salty.abi, provider.getSigner());


      setContract(contract)
    }

    if (ethereum === undefined) {
      setEthereum(window.ethereum);
    }
  })

  // const approveAll = async () => {
  //   try {
  //     if (!ethereum) return alert("Please install MetaMask.");

  //     await contract.approveAll();
  //   } catch (error) {
  //     console.log(error);

  //     throw new Error("No ethereum object");
  //   }
  // }


  const buildShip = async ({ wood }: BuildShipInput) => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      let result = await contract.buildShip(currentAccount, wood);

      return result;
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  }

  // const checkApproval = async () => {
  //   try {
  //     if (!ethereum) return alert("Please install MetaMask.");

  //     let result = await contract.checkApproval();

  //     return result;
  //   } catch (error) {
  //     console.log(error);

  //     throw new Error("No ethereum object");
  //   }
  // }

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_requestAccounts", });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  const disconnectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");
      setCurrentAccount(undefined);
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  const embark = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const embarkResult = await contract.embark(currentAccount, 0);

    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };
  const ships = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      let shipIds = await contract.userShips(currentAccount);

      let ships = [];
      for (let shipId in shipIds) {
        let shipSignature = await contract.ships(shipId.toString());
        ships.push(shipSignature);
      }

      return ships;
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  const userInventory = async () => {
    try {
      let doubloons = await contract.doubloons(currentAccount);
      let wood = await contract.wood(currentAccount);
      console.log(doubloons.toNumber(), "DOUBLOONS");
      console.log(wood.toNumber(), "WOOD");

      return { doubloons, wood }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  }

  return (
    <EthereumContext.Provider
      value={{
        //approveAll,
        buildShip,
        //checkApproval,
        connectWallet,
        contract,
        currentAccount,
        disconnectWallet,
        embark,
        ships,
        userInventory
      }}
    >
      {children}
    </EthereumContext.Provider>
  );
}
