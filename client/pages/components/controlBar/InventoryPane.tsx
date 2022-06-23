import React, { useCallback, useContext, useEffect } from "react"

import { EthereumContext } from '../../../context/EthereumContext'
import { Inventory } from '../../index'

import InventoryTag from './InventoryTag'

interface InventoryPaneProps {
  inventory: Inventory
  setInventory: Function
}

const InventoryPane = ({ inventory, setInventory }: InventoryPaneProps) => {
  const { contract, currentAccount, userInventory } = useContext(EthereumContext)
  if (!contract) throw new Error("Contract is undefined")
  if (!currentAccount) throw new Error("Contract is undefined")

  const fetchInventory = useCallback(async (account: string) => {
    let response = await userInventory(account)

    setInventory({
      crew: response.crew.toNumber(),
      food: response.food.toNumber(),
      furs: response.furs.toNumber(),
      gold: response.gold.toNumber(),
      iron: response.iron.toNumber(),
      porcelain: response.porcelain.toNumber(),
      spice: response.spice.toNumber(),
      wood: response.wood.toNumber()

    })
  }, [currentAccount, inventory])

  const voyageCompleteListener = (
    account: string,
    ship: string,
    success: boolean,
    reward: number,
    event: any
  ) => {
    //console.log(account, "ACCOUNT");
    //console.log(ship, "SHIP");
    //console.log(success, "SUCCESS");
    // console.log(reward, "REWARD");
    // console.log(event, "EVENT");
    // console.log(inventory.doubloons)
    // const newTotal = reward + inventory.doubloons;
    // console.log(newTotal, "NEWTOT")

    // setInventory({ ...inventory, doubloons: newTotal })

    // TODO: this should pull from local state instead
    fetchInventory(currentAccount)
  }

  useEffect(() => {
    fetchInventory(currentAccount)

    contract.on('VoyageComplete', voyageCompleteListener)

    return () => { contract.off('VoyageComplete', voyageCompleteListener) }
  }, [contract, currentAccount])

  return (
    <>
      <InventoryTag bgColor='lightBlue' label='crew' value={inventory.crew} />
      <InventoryTag bgColor='green' label='food' value={inventory.crew} />
      <InventoryTag bgColor='grey' label='furs' value={inventory.crew} />
      <InventoryTag bgColor='yellow' label='gold' value={inventory.crew} />
      <InventoryTag bgColor='red' label='iron' value={inventory.crew} />
      <InventoryTag bgColor='white' label='porcelain' value={inventory.crew} />
      <InventoryTag bgColor='orange' label='spice' value={inventory.crew} />
      <InventoryTag bgColor='brown' label='wood' value={inventory.crew} />
    </>
  )
}

export default InventoryPane
