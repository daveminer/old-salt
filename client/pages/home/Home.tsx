import React from "react";

import styles from "./Home.module.css";

interface HomeProps {
  buildShip: Function
  currentAccount: string | undefined
  userShips: string[]
}

const Home = ({ buildShip, userShips }: HomeProps) => 
  <div className={styles.homeWrapper}>
    <div className={styles.menu}>
      <button
        className={`${styles.buildShip} btn btn-secondary`}
        onClick={() => buildShip()}>
          Build ship
      </button>
    </div>
    <div className={styles.shipScreen}>
      <div className={styles.ships}>
        <div>
        { userShips.length > 0 ?
            userShips.map((ship, idx) => <div key={idx}>{ship}</div>) :
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