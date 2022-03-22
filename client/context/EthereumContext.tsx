import { ethers } from "ethers";
import React, { useEffect, useState } from "react";

import Salty from "../../artifacts/contracts/Salty.sol/Salty.json"

interface EthereumContextInterface {
  buildShip: Function,
  connectWallet: Function,
  contract: ethers.Contract | undefined,
  currentAccount: string | undefined,
  disconnectWallet: Function,
  ships: Function,
  userInventory: Function
}

interface BuildShipInput {
  tar: Number,
  wood: Number
}

const contractAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";

export const EthereumContext =
  React.createContext<EthereumContextInterface>({} as EthereumContextInterface);

export const EthereumProvider = ({ children }: any) => {
  const [contract, setContract] = useState<any>();
  const [ethereum, setEthereum] = useState<any>();
  const [currentAccount, setCurrentAccount] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (window.ethereum === undefined) return;

    if (contract === undefined) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, Salty.abi, provider.getSigner());

      setContract(contract)
    }

    if (ethereum === undefined) { 
      setEthereum(window.ethereum); 
    }
  })

  const buildShip = async ({ tar, wood }: BuildShipInput) => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      let result = await contract.buildShip(currentAccount, tar, wood);

      return result;
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  }

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
      let tar = await contract.tar(currentAccount);
      let wood = await contract.wood(currentAccount);
      console.log(tar.toNumber(), "TAR");
      console.log(wood.toNumber(), "WOOD");

      return { tar, wood }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  }

  return (
    <EthereumContext.Provider
      value={{
        buildShip,
        connectWallet,
        contract,
        currentAccount,
        disconnectWallet,
        ships,
        userInventory
      }}
    >
      {children}
    </EthereumContext.Provider>
  );
}
