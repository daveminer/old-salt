import React, { useEffect, useState } from "react";

//import { ethers } from "ethers";
import abi from "./DummyAbi.json"

interface EthereumContextInterface {
  connectWallet: Function
}

export const EthereumContext =
  React.createContext<EthereumContextInterface>({} as EthereumContextInterface);

const contractAddress = "0xfCCF80344a668b72ac4Be23513F0E9E4a35C84fA";
const contractABI = abi.abi;

export const EthereumProvider = ({ children }: any) => {
  const [ethereum, setEthereum] = useState<any>();
  const [currentAccount, setCurrentAccount] = useState("");

  useEffect(() => {
    setEthereum(window.ethereum)
  })

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

  return (
    <EthereumContext.Provider
      value={{
        connectWallet
      }}
    >
      {children}
    </EthereumContext.Provider>
  );
}
