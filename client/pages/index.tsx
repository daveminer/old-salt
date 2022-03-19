import type { NextPage } from 'next'
import React, { useCallback, useContext, useEffect, useState } from "react";
import Head from 'next/head';

import styles from '../styles/Main.module.css';

import Footer from './Footer';
import Home from './home/Home';
import Landing from './Landing';
import Navbar from './navbar/Navbar';

import { EthereumContext } from '../context/EthereumContext'
import { BigNumber } from 'ethers';

const OldSalt: NextPage = () => {
  const { buildShip, currentAccount, ships, userInventory } = useContext(EthereumContext);

  const [userShips, setUserShips] = useState<BigNumber[]>([])

  const fetchShips = useCallback(async (account) => {
    let response = await ships(account);
    //response = await response.json();
    console.log("SHIP RESP", response);

    setUserShips(response.map((bigInt: any) => bigInt.toBigInt()));
  }, [currentAccount])

  useEffect(() => {
    if (currentAccount == undefined) return;

    fetchShips(currentAccount);
    userInventory(currentAccount);
  }, [currentAccount])

  return (
    <>
      <div className={styles.view}>
        <Head>
          <title>Old Salt</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Navbar currentAccount={currentAccount} />

        <main className={styles.main}>
          {currentAccount ?
            <Home 
              buildShip={buildShip}
              currentAccount={currentAccount}
              userShips={userShips} 
            />
          : <Landing />
          }
        </main>
      </div>
      <Footer />
    </>
  )
}

export default OldSalt
