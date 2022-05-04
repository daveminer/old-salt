import React, { useCallback, useContext, useEffect } from 'react'

import { Box } from '@chakra-ui/react'

import { EthereumContext } from '../../context/EthereumContext'

interface HomeProps {
  setTxInProgress: Function
  setUserShips: Function
  setCurrentScreen: Function
  userShips: any[]
}

const shipType = (signature: any) => {
  let bits = BigInt(signature.toString()).toString(2)
  if (bits.length < 256) {
    bits.padStart(256, '0')
  }

  let type = parseInt(bits.substring(0, 4), 2) % 4

  if (type == 3) {
    return 'galleon'
  } else if (type == 2) {
    return 'carrack'
  } else if (type == 1) {
    return 'brig'
  } else return 'sloop'
}

const Home = ({ setUserShips, userShips }: HomeProps) => {
  const { currentAccount, ships } = useContext(EthereumContext)

  const fetchShips = useCallback(async (account) => {
    let response = await ships(account)

    console.log(response, "SHPS")

    setUserShips(response)
  }, [currentAccount])

  useEffect(() => {
    if (currentAccount == undefined) return

    fetchShips(currentAccount)
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
              console.log(ship.sunk_at, "SHIP")

              return (
                <Box key={`ship-${idx}`}>
                  <Box key={`signature-${idx}`}>{ship[0].toString()}</Box>
                  <Box key={`shipType-${idx}`}>
                    {shipType(ship.signature)}
                  </Box>
                </Box>
              )
            }) :
            <div>No ships.</div>
          }
        </Box>
      </Box>
      <Box
        gridColumn={'2/5'}
      >
        {userShips.length > 0 ?
          userShips.map((ship, idx) => {
            console.log(BigInt(ship.sunk_at), "SHIP")

            return (BigInt(ship.sunk_at) > 0 ?
              <Box key={`ship-sunk-${idx}`}>
                Sunk on block: {BigInt(ship.sunk_at).toString()}
              </Box> : <Box key={`ship-sunk-${idx}`} >Afloat</Box>)
          }) :
          <div>No ships.</div>
        }
      </Box>
    </Box >
  )
}

export default Home
