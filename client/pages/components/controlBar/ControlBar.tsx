import React, { useContext } from "react"

import { EthereumContext } from '../../../context/EthereumContext'
import { GameScreen, Inventory } from '../../index'
import BuildShip from "../buildShip/BuildShip"
import Embark from "../embark/Embark"
import InventoryPane from "./InventoryPane"

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
  ships: string[]
}

const ControlBar = ({ currentScreen,
  inventory,
  setInventory,
  setScreen,
  setTxInProgress,
  setUserShips,
  ships
}: ControlBarProps) => {
  const { currentAccount } = useContext(EthereumContext)
  const buildShipModal = useDisclosure()
  const embarkModal = useDisclosure()

  const openShipModal = () => buildShipModal.onOpen()
  const openEmbarkModal = () => embarkModal.onOpen()

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
              onClick={() => openShipModal()}>
              Build a ship
            </Button>
          }
          {(currentScreen === GameScreen.CityDetail) &&
            <Button
              colorScheme='green'
              onClick={() => openEmbarkModal()}>
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
        isOpen={buildShipModal.isOpen}
        onClose={buildShipModal.onClose}
        onOpen={buildShipModal.onOpen}
        setTxInProgress={setTxInProgress}
        setUserShips={setUserShips}
      />
      <Embark
        currentAccount={currentAccount}
        isOpen={embarkModal.isOpen}
        onClose={embarkModal.onClose}
        onOpen={embarkModal.onOpen}
        setTxInProgress={setTxInProgress}
        setShips={setUserShips}
        ships={ships}
      />
    </>
  )
}

export default ControlBar
