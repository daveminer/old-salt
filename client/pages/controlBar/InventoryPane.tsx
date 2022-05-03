import React, { useCallback, useContext, useEffect } from "react";

import { EthereumContext } from '../../context/EthereumContext';
import { Inventory } from '../index';

import {
  Tag,
} from '@chakra-ui/react'

interface InventoryPaneProps {
  inventory: Inventory
  setInventory: Function
}

const InventoryPane = ({ inventory, setInventory }: InventoryPaneProps) => {
  const { contract, currentAccount, userInventory } = useContext(EthereumContext);
  if (!contract) throw new Error("Contract is undefined");

  const fetchInventory = useCallback(async (account) => {
    let response = await userInventory(account);

    setInventory({
      doubloons: response.doubloons.toNumber(),
      wood: response.wood.toNumber()
    });
  }, [currentAccount, inventory]);

  const voyageCompleteListener = (account: string, ship: string, success: boolean, reward: number, event: any) => {
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
    fetchInventory(currentAccount);

    console.log(inventory, "INV")

    contract.on('VoyageComplete', voyageCompleteListener)

    return () => { contract.off('VoyageComplete', voyageCompleteListener); }
  }, [contract, currentAccount]);

  return (
    <>
      <Tag
        size='lg'
        colorScheme='yellow'
        borderRadius='full'
        verticalAlign={'middle'}
      >
        Doubloons: {inventory.doubloons}
      </Tag>
      <Tag
        marginLeft={4}
        size='lg'
        colorScheme='green'
        borderRadius='full'
        verticalAlign={'middle'}
      >
        Wood: {inventory.wood}
      </Tag>
    </>
  )
};

export default InventoryPane;
