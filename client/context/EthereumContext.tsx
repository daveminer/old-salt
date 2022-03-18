import { ethers } from "ethers";
import React, { useEffect, useState } from "react";

import Salty from "../../artifacts/contracts/Salty.sol/Salty.json"

interface EthereumContextInterface {
  buildShip: Function,
  connectWallet: Function,
  contract: ethers.Contract | undefined,
  currentAccount: string | undefined,
  disconnectWallet: Function,
  keels: Function,
  ships: Function,
  shipsTwo: Function,
  userInventory: Function
}

const contractAddress = "0x0165878A594ca255338adfa4d48449f69242Eb8F";

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

  const buildKeel = async () => {
    try {
      console.log('buildKeel');
      if (!ethereum) return alert("Please install MetaMask.");

      let result = await contract.buildKeel(currentAccount);
      //const accounts = await ethereum.request({method: "eth_requestAccounts"});

      //const keels = contract.keels();
      console.log("RES", result);

      return result;

    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  }

  const buildShip = async () => {
    try {
      console.log('buildShip');
      if (!ethereum) return alert("Please install MetaMask.");

      let result = await contract.buildShip(currentAccount);

      console.log("RES", result);

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

  const keels = async () => {
    try {
      console.log(ethereum, 'firing');
      if (!ethereum) return alert("Please install MetaMask.");
      console.log("CURR", currentAccount)
      let result = await contract.userKeels(currentAccount);
      //const accounts = await ethereum.request({method: "eth_requestAccounts"});

      //const keels = contract.keels();
      console.log("RES", result);

      return result.map((id: Number) => id.toString());

    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  const ships = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      let result = await contract.userShips(currentAccount);
      console.log("SHIPRESSS", result)
      
      return result.map((id: Number) => id.toString());
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  const shipsTwo = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      let result = await contract.ships(0);
      let resultTwo = await contract.ships(1);
      //let resultThree = await contract.ships(2);
      //let resultFour = await contract.ships(3);
      //let resultFive = await contract.ships(4);
      console.log("SHIPRESSsssss", result.toString())
      console.log("SHIPRESSSfffff", resultTwo.toString())
      //console.log("SHIPRESSSffssssssafff", resultThree.toString())
      //console.log("SHfff", resultFour.toString())
      //console.log("SHIPREsafff", resultFive.toString())
      
      return [result.toString(), resultTwo.toString()]//, resultThree.toString(), resultFour.toString()]//, resultFive.toString()];
      //return result.concat(resultTwo).map((id: Number) => id.toString());
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  const userInventory = async () => {
    try {
      let result = await contract.userInventory(currentAccount);
      console.log("RESULT", result);
      return result
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
        keels,
        ships,
        shipsTwo,
        userInventory
      }}
    >
      {children}
    </EthereumContext.Provider>
  );
}
