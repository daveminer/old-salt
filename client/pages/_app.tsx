import '../styles/globals.css'
import type { AppProps } from 'next/app'

import { ChakraProvider } from '@chakra-ui/react';
import { EthereumProvider } from '../context/EthereumContext';

import { extendTheme } from '@chakra-ui/react'

declare global {
  interface Window { ethereum: any }
}

const colors = {
  background: '#E9E5C0',
}

const theme = extendTheme({ colors })

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <EthereumProvider>
        <Component {...pageProps} />
      </EthereumProvider>
    </ChakraProvider>
  )
}

export default MyApp
