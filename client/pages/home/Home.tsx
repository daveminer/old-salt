import React, { useCallback, useContext, useEffect } from "react";

import { EthereumContext } from '../../context/EthereumContext'

import { Box } from '@chakra-ui/react';

interface HomeProps {
  setTxInProgress: Function
  setUserShips: Function
  setCurrentScreen: Function
  userShips: string[]
}

const shipType = (signature: any) => {
  let bits = BigInt(signature.toString()).toString(2)
  if (bits.length < 256) {
    bits.padStart(256, '0')
  }

  let type = parseInt(bits.substring(0, 4), 2) % 4

  if (type == 3) {
    return 'galleon';
  } else if (type == 2) {
    return 'carrack'
  } else if (type == 1) {
    return 'brig'
  } else return 'sloop'
}

const Home = ({ setUserShips, userShips }: HomeProps) => {
  const { currentAccount, ships } = useContext(EthereumContext);

  const fetchShips = useCallback(async (account) => {
    let response = await ships(account);

    setUserShips(response.map((bigInt: any) => bigInt.toBigInt()));
  }, [currentAccount])

  useEffect(() => {
    if (currentAccount == undefined) return;

    fetchShips(currentAccount);
  }, [currentAccount])

  return (
    <Box
      display={'grid'}
      flex={1}
      width={'100%'}
    >
      <Box>
        <Box>
          {userShips.length > 0 ?
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
        </Box>
      </Box>
      <Box
        gridColumn={'2/5'}
      >
        Details
      </Box>
    </Box >
  )
}

export default Home;
