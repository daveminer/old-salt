import React, { useContext } from "react";
import { EthereumContext } from '../../context/EthereumContext'
import {
  Box,
  HStack,
  Button,
  Text
} from '@chakra-ui/react';

type NavbarProps = {
  currentAccount: string | undefined,
}

const Navbar = ({ currentAccount }: NavbarProps) => {
  const { connectWallet, disconnectWallet } = useContext(EthereumContext);

  return (
    <HStack
      margin='1rem'
      spacing='auto'
    >
      <Box>
        <Text
            textAlign='left'
            fontSize='xl'
            fontWeight='bold'
            fontFamily='heading'>
          Old Salt
        </Text>
      </Box>
      { currentAccount ?
        <>
          <Box className="">
            Account: {currentAccount}
          </Box>
     
          <Button colorScheme='blue'
            onClick={() => disconnectWallet()}
          >
            Disconnect wallet
          </Button>
        </>
      : <>
          <Button
            colorScheme='blue'
            onClick={() => connectWallet()}
          >
            Connect wallet
          </Button>
        </>
      }
    </HStack>
  )
}

export default Navbar;