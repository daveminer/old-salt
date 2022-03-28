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

const OldSalt: NextPage = () => {
  const { currentAccount } = useContext(EthereumContext);

  const [currentCity, setCurrentCity] = useState<string | undefined>(undefined)
  const [currentScreen, setCurrentScreen] = useState<string | undefined>(undefined)
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

        <Navbar currentAccount={currentAccount} txInProgress={txInProgress} />

        <main className={styles.main}>
          {
            function () {
              if (!currentAccount) {
                return <Landing />
              }

              if (currentScreen === 'cityList') {
                return <CityList setCurrentCity={setCurrentCity} setCurrentScreen={setCurrentScreen} />
              }

              if (currentScreen === 'cityDetails') {
                if (currentCity === undefined) {
                  console.error('City missing for city details view.');
                  return;
                }

                return <CityDetails city={currentCity} />
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
        </main>
      </div>
      <Footer />
    </ChakraProvider>
  )
}

export default OldSalt
