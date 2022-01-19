import type { NextPage } from 'next'
import React, { useCallback, useContext, useEffect, useState } from "react";
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import { EthereumContext } from '../context/EthereumContext'

const Home: NextPage = () => {
  const { buildKeel, connectWallet, contract, currentAccount, disconnectWallet, keels } = useContext(EthereumContext);

  const [userKeels, setUserKeels] = useState<String[]>([]);

  const fetchKeels = useCallback(async (account) => {
    let response = await keels(account);
    //response = await response.json();
    console.log("RESP", response);

    setUserKeels(response);
  }, [currentAccount])

  useEffect(() => {
    if (currentAccount == undefined) return;
    if (contract == undefined) return;

    fetchKeels(currentAccount)
  }, [contract, currentAccount])

  return (
    <div className={styles.container}>
      <Head>
        <title>Old Salt</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="/">OldSalt</a>
          { currentAccount ?
            <button onClick={() => disconnectWallet()}
              className="btn btn-primary ms-auto"
            >
              Disconnect wallet
            </button>
          : <button onClick={() => connectWallet()}
              className="btn btn-primary ms-auto"
            >
              Connect wallet
            </button>
          }
      </nav>

      <main className={styles.main}>
        {currentAccount ?
          <>
            <div>
              Account: {currentAccount}
            </div>
            <div>
              Keels:
              {
                userKeels.map((keel, idx) => <div key={idx}>{keel}</div>)
              }
              Build a keel:
              <button className="btn btn-primary" onClick={() => buildKeel()}>Build keel</button>
            </div>
          </>
        :
          <>
            <h1 className={styles.title}>
              Welcome to <a href="https://nextjs.org">Next.js!</a>
            </h1>

            <p className={styles.description}>
              Get started by editing{' '}
              <code className={styles.code}>pages/index.tsx</code>
            </p>

            <div className={styles.grid}>
              <a href="https://nextjs.org/docs" className={styles.card}>
                <h2>Documentation &rarr;</h2>
                <p>Find in-depth information about Next.js features and API.</p>
              </a>

              <a href="https://nextjs.org/learn" className={styles.card}>
                <h2>Learn &rarr;</h2>
                <p>Learn about Next.js in an interactive course with quizzes!</p>
              </a>

              <a
                href="https://github.com/vercel/next.js/tree/master/examples"
                className={styles.card}
              >
                <h2>Examples &rarr;</h2>
                <p>Discover and deploy boilerplate example Next.js projects.</p>
              </a>

              <a
                href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                className={styles.card}
              >
                <h2>Deploy &rarr;</h2>
                <p>
                  Instantly deploy your Next.js site to a public URL with Vercel.
                </p>
              </a>
            </div>
          </>
        }
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div >
  )
}

export default Home