import React, { useContext } from "react";
import { EthereumContext } from '../../context/EthereumContext'
import {
  Box,
  HStack,
  Text
} from '@chakra-ui/react';
import ConnectButton from "./ConnectButton";

type NavbarProps = {
  currentAccount: string | undefined,
  setScreen: Function,
  txInProgress: boolean
}

const Navbar = ({ currentAccount, setScreen, txInProgress }: NavbarProps) => {
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
      <ConnectButton
        connectWallet={connectWallet}
        currentAccount={currentAccount}
        disconnectWallet={disconnectWallet}
        setScreen={setScreen}
        txInProgress={txInProgress}
      />
    </HStack>
  )
}

export default Navbar;
