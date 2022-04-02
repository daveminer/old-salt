import React, { useCallback, useContext, useEffect } from "react";

import { EthereumContext } from '../../context/EthereumContext';
import { GameScreen, Inventory } from '../index';
import BuildShip from "../buildShip/BuildShip";

import {
  Box,
  Button,
  Tag,
  useDisclosure
} from '@chakra-ui/react'

interface ShipyardControlBar {
  inventory: Inventory
  screen: GameScreen
  setInventory: Function
  setScreen: Function
  setTxInProgress: Function
  setUserShips: Function
}

const ShipyardControlBar = ({ inventory, setInventory, screen, setScreen, setTxInProgress, setUserShips }: ShipyardControlBar) => {
  const { currentAccount, userInventory } = useContext(EthereumContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const buildShipModal = () => onOpen();

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
      <Box
        borderColor={'black'}
        borderWidth={'px 0px 0px 0px'}
        borderStyle={'solid'}
        display={'flex'}
        justifyContent={'space-between'}
        width={'100%'}
      >
        <Box
          margin={4}
        >
          <Button
            colorScheme='green'
            marginRight='16'
            onClick={() => buildShipModal()}>
            Build a ship
          </Button>
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
        </Box>
        <Box
          margin={4}
        >
          <Button
            colorScheme='orange'
            onClick={() => setScreen(GameScreen.Map)}>
            Destinations
          </Button>
        </Box>
      </Box>
      <BuildShip
        currentAccount={currentAccount}
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
        setTxInProgress={setTxInProgress}
        setUserShips={setUserShips}
      />
    </>
  )
};

export default ShipyardControlBar;
