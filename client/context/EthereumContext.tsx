import { ethers } from "ethers";
import React, { useEffect, useState } from "react";

import Salty from "../../artifacts/contracts/Salty.sol/Salty.json"

interface EthereumContextInterface {
  buildKeel: Function,
  connectWallet: Function,
  contract: ethers.Contract | undefined,
  currentAccount: String | undefined,
  disconnectWallet: Function,
  keels: Function
}

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const EthereumContext =
  React.createContext<EthereumContextInterface>({} as EthereumContextInterface);

export const EthereumProvider = ({ children }: any) => {
  const [contract, setContract] = useState<any>();
  const [ethereum, setEthereum] = useState<any>();
  const [currentAccount, setCurrentAccount] = useState<String | undefined>(undefined);

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
      console.log('firing');
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

  return (
    <EthereumContext.Provider
      value={{
        buildKeel,
        connectWallet,
        contract,
        currentAccount,
        disconnectWallet,
        keels
      }}
    >
      {children}
    </EthereumContext.Provider>
  );
}
