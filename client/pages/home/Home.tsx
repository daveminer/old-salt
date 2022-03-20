import React from "react";

import { BigNumber } from 'ethers';

import styles from "./Home.module.css";

interface HomeProps {
  buildShip: Function
  currentAccount: string | undefined
  userShips: BigNumber[]
}

const shipType = (signature: any) => {
  let bits = BigInt(signature.toString()).toString(2)
  if (bits.length < 256) {
    bits.padStart(256, '0')
  }

  let type = parseInt(bits.substring(0,4), 2) % 4

  if (type == 3) {
    return 'galleon';
  } else if (type == 2) {
    return 'carrack'
  } else if (type == 1) {
    return 'brig'
  } else return 'sloop'
}


const Home = ({ buildShip, userShips }: HomeProps) => 
  <div className={styles.homeWrapper}>
    <div className={styles.menu}>
      <button
        className={`${styles.buildShip} btn btn-secondary`}
        onClick={() => buildShip()}>
          Build ship
      </button>
      <label className={styles.inventoryItem}>Wood:</label>
      <label className={styles.inventoryAmount}>{1234}</label>
      <label className={styles.inventoryItem}>Tar:</label>
      <label className={styles.inventoryAmount}>{5678}</label>
    </div>
    <div className={styles.shipScreen}>
      <div className={styles.ships}>
        <div>
        { userShips.length > 0 ?
            userShips.map((ship, idx) => {
              return <div>
                <div key={idx}>{ship.toString()}</div>
                <div>
                  {shipType(ship)}
                </div>
              </div>
            }) :
            <div>No ships.</div>
        }
        </div>
      </div>
      <div className={styles.details}>
        Details
      </div>
    </div>
  </div>

export default Home;