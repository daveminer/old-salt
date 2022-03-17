import React, { useContext } from "react";
import { EthereumContext } from '../../context/EthereumContext'

import styles from "./Navbar.module.css"

type NavbarProps = {
  currentAccount: string | undefined,
}

const Navbar = ({ currentAccount }: NavbarProps) => {
  const { connectWallet, disconnectWallet } = useContext(EthereumContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a className={styles.navbarBrand} href="/">OldSalt</a>
      { currentAccount ?
        <>
          <div className="ms-auto mf-auto">
            Account: {currentAccount}
          </div>
          <button onClick={() => disconnectWallet()}
            className={`${styles.navbarWalletConnectButton} btn btn-primary`}
          >
            Disconnect wallet
          </button>
        </>
      : <button onClick={() => connectWallet()}
          className={`${styles.navbarWalletConnectButton} btn btn-primary`}
        >
          Connect wallet
        </button>
      }
    </nav>
  )
}

export default Navbar;