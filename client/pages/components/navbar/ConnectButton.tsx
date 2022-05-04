import {
  Box,
  Button,
  Spinner,
  Text
} from '@chakra-ui/react'
import { GameScreen } from '../..'

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
        onClick={async () => {
          await connectWallet()
          setScreen(GameScreen.Shipyard)
        }}
      >
        Connect wallet
      </Button>
    )
  }

  if (txInProgress) {
    return (
      <>
        <Box>
          Account: {currentAccount}
        </Box>
        <Button
          onClick={async () => {
            await disconnectWallet()
            setScreen(GameScreen.Landing)
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
      <Text>
        Account: {currentAccount}
      </Text>
      <Button
        onClick={() => {
          setScreen(GameScreen.Landing)
          disconnectWallet()
        }}
      >
        Disconnect wallet
      </Button>
    </>
  )
}

export default ConnectButton
