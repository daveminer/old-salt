import { ethers } from "ethers"
import React, { useEffect, useState } from "react"

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
  beam: number
  keel: number
  shipLength: number
  wood: number
}

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS

export const EthereumContext =
  React.createContext<EthereumContextInterface>({} as EthereumContextInterface)

export const EthereumProvider = ({ children }: any) => {
  const [contract, setContract] = useState<any>()
  const [ethereum, setEthereum] = useState<any>()
  const [currentAccount, setCurrentAccount] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (window.ethereum === undefined) return
    if (contractAddress === undefined) {
      console.error("CONTRACT_ADDRESS is undefined.")
      return
    }

    if (contract === undefined) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)

      const filter = {}
      // provider.on(filter, (log, event) => {
      //   console.log(log, "CHAIN EVENT LOG");
      //   console.info(event, "CHAIN EVENT");
      // })

      const contract = new ethers.Contract(contractAddress, Salty.abi, provider.getSigner())


      setContract(contract)
    }

    if (ethereum === undefined) {
      setEthereum(window.ethereum)
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


  const buildShip = async ({ beam, keel, shipLength, wood }: BuildShipInput) => {
    try {
      if (!ethereum) return alert("Please install MetaMask.")

      let result = await contract.buildShip(currentAccount, beam, keel, shipLength, wood)

      return result
    } catch (error) {
      console.log(error)

      throw new Error("No ethereum object")
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
      if (!ethereum) return alert("Please install MetaMask.")

      const accounts = await ethereum.request({ method: "eth_requestAccounts", })

      setCurrentAccount(accounts[0])
    } catch (error) {
      console.log(error)

      throw new Error("No ethereum object")
    }
  }

  const disconnectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.")
      setCurrentAccount(undefined)
    } catch (error) {
      console.log(error)

      throw new Error("No ethereum object")
    }
  }

  const embark = async ({ shipIndex: shipIndex }: any) => {
    try {
      if (!ethereum) return alert("Please install MetaMask.")

      const embarkResult = await contract.embark(currentAccount, shipIndex)

    } catch (error) {
      console.log(error)

      throw new Error("No ethereum object")
    }
  }
  const ships = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.")

      let shipIds = await contract.userShips(currentAccount)

      let ships = []
      for (let shipId in shipIds) {
        console.log(shipId, "SHIPID")
        let shipSignature = await contract.ships(shipId.toString())
        let shipWithId = { shipIndex: shipId, ...shipSignature }
        console.log(shipSignature, "SHIPSIG")
        console.log(shipWithId, "SHIPPPPP")
        ships.push(shipWithId)
      }

      return ships
    } catch (error) {
      console.log(error)

      throw new Error("No ethereum object")
    }
  }

  const userInventory = async () => {
    try {
      let crew = await contract.crew(currentAccount)
      let food = await contract.food(currentAccount)
      let furs = await contract.food(currentAccount)
      let gold = await contract.gold(currentAccount)
      let iron = await contract.iron(currentAccount)
      let porcelain = await contract.porcelain(currentAccount)
      let spice = await contract.spice(currentAccount)
      let wood = await contract.wood(currentAccount)

      return {
        crew,
        food,
        furs,
        gold,
        iron,
        porcelain,
        spice,
        wood
      }
    } catch (error) {
      console.log(error)

      throw new Error("No ethereum object")
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
  )
}
