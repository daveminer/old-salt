import {
  Box,
  Button,
  Spinner
} from '@chakra-ui/react';
import { GameScreen } from '..';

interface ConnectButtonProps {
  connectWallet: Function,
  disconnectWallet: Function,
  currentAccount: string | undefined,
  setScreen: Function,
  txInProgress: boolean
}

const ConnectButton = ({
  connectWallet,
  currentAccount,
  disconnectWallet,
  setScreen,
  txInProgress
}: ConnectButtonProps) => {
  if (!currentAccount) {
    return (
      <Button
        colorScheme='blue'
        onClick={async () => {
          await connectWallet();
          setScreen(GameScreen.Shipyard);
        }}
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
          onClick={async () => {
            await disconnectWallet();
            setScreen(GameScreen.Landing);
          }}
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
        onClick={() => {
          setScreen(GameScreen.Landing);
          disconnectWallet();
        }}
      >
        Disconnect wallet
      </Button>
    </>
  )
}

export default ConnectButton;
