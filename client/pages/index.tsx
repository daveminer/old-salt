import type { NextPage } from 'next'
import React, { useContext, useState } from "react";
import Head from 'next/head';

import Footer from './Footer';
import Home from './home/Home';
import Landing from './Landing';
import Navbar from './navbar/Navbar';

import { ChakraProvider } from '@chakra-ui/react'

import { EthereumContext } from '../context/EthereumContext'

import styles from '../styles/Main.module.css';
import CityList from './city';
import CityDetails from './city/show';
import MapControlBar from './controlBar/MapControlBar'
import ShipyardControlBar from './controlBar/ShipyardControlBar'

import { Box } from '@chakra-ui/react';

export enum GameScreen {
  Landing = "landing",
  Map = "map",
  Shipyard = "shipyard",
  CityDetail = "city_detail"
}

export interface Inventory {
  tar: Number,
  wood: Number
}


const OldSalt: NextPage = () => {
  const { currentAccount } = useContext(EthereumContext);

  const [currentCity, setCurrentCity] = useState<string | undefined>(undefined)
  const [currentScreen, setCurrentScreen] = useState<GameScreen>(GameScreen.Landing)
  const [inventory, setInventory] = useState<Inventory>({ tar: 0, wood: 0 })
  const [txInProgress, setTxInProgress] = useState<boolean>(false);
  const [userShips, setUserShips] = useState<string[]>([]);

  return (
    <ChakraProvider>
      <div className={styles.view}>
        <Head>
          <title>Old Salt</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

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

        <Box className={styles.main}>
          {
            function () {
              if (currentScreen === GameScreen.Shipyard) {
                return <ShipyardControlBar
                  inventory={inventory}
                  screen={currentScreen}
                  setInventory={setInventory}
                  setScreen={setCurrentScreen}
                  setTxInProgress={setTxInProgress}
                  setUserShips={setUserShips}
                />
              }
              if (currentScreen === GameScreen.Map) {
                return <MapControlBar
                  inventory={inventory}
                  screen={currentScreen}
                  setInventory={setInventory}
                  setScreen={setCurrentScreen}
                  setTxInProgress={setTxInProgress}
                  setUserShips={setUserShips}
                />
              }

              return null;
            }()
          }
          {
            function () {
              if (!currentAccount) {
                return <Landing />
              }

              if (currentScreen === GameScreen.Map) {
                return <CityList setCurrentCity={setCurrentCity} setCurrentScreen={setCurrentScreen} />
              }

              if (currentScreen === GameScreen.CityDetail) {
                if (currentCity === undefined) {
                  console.error('City missing for city details view.');
                  return;
                }

                return <CityDetails city={currentCity} population={100} setScreen={setCurrentScreen} />
              }

              return (
                <Home
                  setTxInProgress={setTxInProgress}
                  setUserShips={setUserShips}
                  setCurrentScreen={setCurrentScreen}
                  userShips={userShips}
                />
              )
            }()
          }
        </Box>
      </div>
      <Footer />
    </ChakraProvider>
  )
}

export default OldSalt
