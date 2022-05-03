import type { NextPage } from 'next'
import React, { useContext, useState } from "react";

import Footer from './Footer';
import Home from './home/Home';
import Landing from './Landing';
import Navbar from './navbar/Navbar';

import { EthereumContext } from '../context/EthereumContext'

import theme from './theme'
//import styles from '../styles/Main.module.css';
import CityList from './city';
import CityDetails from './city/show';
import ControlBar from './controlBar/ControlBar'

import { Box } from '@chakra-ui/react';

export enum GameScreen {
  Landing = "landing",
  Map = "map",
  Shipyard = "shipyard",
  CityDetail = "city_detail"
}

export interface Inventory {
  doubloons: number,
  wood: number
}

const OldSalt: NextPage = () => {
  const { currentAccount } = useContext(EthereumContext);

  const [currentCity, setCurrentCity] = useState<string | undefined>(undefined)
  const [currentScreen, setCurrentScreen] = useState<GameScreen>(GameScreen.Landing)
  const [inventory, setInventory] = useState<Inventory>({ doubloons: 0, wood: 0 })
  const [txInProgress, setTxInProgress] = useState<boolean>(false);
  const [userShips, setUserShips] = useState<string[]>([]);

  return (
    <Box backgroundColor={theme.colors.background}>
      <Box
        display="flex"
        flex={1}
        flexDirection="column"
        minHeight="100vh"
      >
        <Box
          borderColor={'black'}
          borderWidth={'0px 0px 0px 0px'}
          borderStyle={'solid'}
        >
          <Navbar
            currentAccount={currentAccount}
            setScreen={setCurrentScreen}
            txInProgress={txInProgress}
          />
        </Box>
        <Box
          display="flex"
          flex={1}
          flexDirection="column"
          justifyContent="flex-start"
          alignItems="center"
        >
          {(currentScreen !== GameScreen.Landing) &&
            <ControlBar
              currentScreen={currentScreen}
              inventory={inventory}
              setInventory={setInventory}
              setScreen={setCurrentScreen}
              setTxInProgress={setTxInProgress}
              setUserShips={setUserShips}
              ships={userShips}
            />
          }
          {
            function () {
              if (!currentAccount) {
                return <Landing />
              }

              if (currentScreen === GameScreen.Map) {
                return <CityList
                  setCurrentCity={setCurrentCity}
                  setCurrentScreen={setCurrentScreen}
                />
              }

              if (currentScreen === GameScreen.CityDetail) {
                if (currentCity === undefined) {
                  console.error('City missing for city details view.');
                  return;
                }

                return <CityDetails
                  city={currentCity}
                  population={100}
                  setScreen={setCurrentScreen}
                />
              }

              return <Home
                setTxInProgress={setTxInProgress}
                setUserShips={setUserShips}
                setCurrentScreen={setCurrentScreen}
                userShips={userShips}
              />
            }()
          }
        </Box>
      </Box>
      <Footer />
    </Box>
  )
}

export default OldSalt
