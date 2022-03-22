import React, { useCallback, useContext, useEffect, useState } from "react";

import { useDisclosure } from "@chakra-ui/react";
import { EthereumContext } from '../../context/EthereumContext'
import { BigNumber } from 'ethers';

import BuildShip from "../buildShip/BuildShip";

import styles from "./Home.module.css";

interface Inventory {
  tar: Number,
  wood: Number
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

const Home = () => {
  const { currentAccount, ships, userInventory } = useContext(EthereumContext);

  const [inventory, setInventory] = useState<Inventory>({tar: 0, wood: 0})
  const [userShips, setUserShips] = useState<BigNumber[]>([])

  const { isOpen, onOpen, onClose } = useDisclosure()

  const fetchShips = useCallback(async (account) => {
    let response = await ships(account);

    setUserShips(response.map((bigInt: any) => bigInt.toBigInt()));
  }, [currentAccount])

  const fetchInventory = useCallback(async (account) => {
    let response = await userInventory(account);

    setInventory({
      tar: response.tar.toNumber(),
      wood: response.wood.toNumber()
    });
  }, [currentAccount])

  const buildShipModal = () => {
    onOpen();
  }

  useEffect(() => {
    if (currentAccount == undefined) return;

    fetchShips(currentAccount);
    fetchInventory(currentAccount);
  }, [currentAccount])

  return <div className={styles.homeWrapper}>
    <div className={styles.menu}>
      <button
        className={`${styles.buildShip} btn btn-secondary`}
        onClick={() => buildShipModal()}>
          Build a ship
      </button>
      <label className={styles.inventoryItem}>Wood:</label>
      <label className={styles.inventoryAmount}>{inventory.wood}</label>
      <label className={styles.inventoryItem}>Tar:</label>
      <label className={styles.inventoryAmount}>{inventory.tar}</label>
    </div>
    <div className={styles.shipScreen}>
      <div className={styles.ships}>
        <div>
        { userShips.length > 0 ?
            userShips.map((ship, idx) => {
              return <div key={`ship-${idx}`}>
                <div key={`signature-${idx}`}>{ship.toString()}</div>
                <div key={`shipType-${idx}`}>
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
    <BuildShip isOpen={isOpen} onClose={onClose} onOpen={onOpen} />
  </div>
}

export default Home;