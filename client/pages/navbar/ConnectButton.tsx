import {
  Box,
  Button,
  Spinner
} from '@chakra-ui/react';

interface ConnectButtonProps {
  connectWallet: Function,
  disconnectWallet: Function,
  currentAccount: string | undefined
  txInProgress: boolean
}

const ConnectButton = ({
  connectWallet,
  currentAccount,
  disconnectWallet,
  txInProgress
}: ConnectButtonProps) => {
  if (!currentAccount) {
    return (
      <Button
        colorScheme='blue'
        onClick={() => connectWallet()}
      >
        Connect wallet
      </Button>
    )
  }

  if (txInProgress) {
    return (
      <>
        <Box className="">
          Account: {currentAccount}
        </Box>
        <Button colorScheme='blue'
          onClick={() => disconnectWallet()}
        >
          <Spinner 
            marginRight='.75rem'
          />
          Tx in progress
        </Button>
      </>
    )
  }

  return (
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
  )
}

export default ConnectButton;