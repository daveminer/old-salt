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
  const { currentAccount, userInventory } = useContext(EthereumContext);

  const fetchInventory = useCallback(async (account) => {
    let response = await userInventory(account);

    setInventory({
      tar: response.tar.toNumber(),
      wood: response.wood.toNumber()
    });
  }, [currentAccount]);

  useEffect(() => {
    fetchInventory(currentAccount);
  }, [currentAccount]);

  return (
    <>
      <Tag
        size='lg'
        colorScheme='green'
        borderRadius='full'
        verticalAlign={'middle'}
      >
        Wood: {inventory.wood}
      </Tag>
      <Tag
        marginLeft={4}
        size='lg'
        colorScheme='blackAlpha'
        borderRadius='full'
        verticalAlign={'middle'}
      >
        Tar: {inventory.tar}
      </Tag>
      <Tag
        marginLeft={4}
        size='lg'
        colorScheme='yellow'
        borderRadius='full'
        verticalAlign={'middle'}
      >
        Gold: {'00'}
      </Tag>
    </>
  )
};

export default InventoryPane;
