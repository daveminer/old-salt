import React, { useContext } from "react";

import { EthereumContext } from '../../context/EthereumContext';
import { GameScreen, Inventory } from '../index';
import BuildShip from "../buildShip/BuildShip";
import InventoryPane from "./InventoryPane";

import {
  Box,
  Button,
  useDisclosure
} from '@chakra-ui/react'

interface ControlBarProps {
  currentScreen: GameScreen
  inventory: Inventory
  setInventory: Function
  setScreen: Function
  setTxInProgress: Function
  setUserShips: Function
}

const ControlBar = ({ currentScreen,
  inventory,
  setInventory,
  setScreen,
  setTxInProgress,
  setUserShips
}: ControlBarProps) => {
  const { currentAccount } = useContext(EthereumContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const buildShipModal = () => onOpen();

  return (
    <>
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        width={'100%'}
      >
        <Box
          margin={4}
        >
          <InventoryPane inventory={inventory} setInventory={setInventory} />
        </Box>
        <Box
          margin={4}
        >
          {(currentScreen === GameScreen.Shipyard) &&
            <Button
              colorScheme='green'
              onClick={() => buildShipModal()}>
              Build a ship
            </Button>
          }
          {(currentScreen === GameScreen.CityDetail) &&
            <Button
              colorScheme='green'
              onClick={() => embarkModal()}>
              Embark
            </Button>
          }
          {(currentScreen !== GameScreen.Shipyard) &&
            <Button
              colorScheme='orange'
              onClick={() => setScreen(GameScreen.Shipyard)}
              marginLeft='4'
            >
              Shipyard
            </Button>
          }
          {(currentScreen !== GameScreen.Map) &&
            <Button
              colorScheme='orange'
              onClick={() => setScreen(GameScreen.Map)}
              marginLeft='4'
            >
              Map
            </Button>
          }
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

export default ControlBar;
