import '../styles/globals.css'
import type { AppProps } from 'next/app'

import { ChakraProvider } from '@chakra-ui/react';
import { EthereumProvider } from '../context/EthereumContext';

declare global {
  interface Window { ethereum: any }
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <EthereumProvider>
        <Component {...pageProps} />
      </EthereumProvider>
    </ChakraProvider>
  )
}

export default MyApp
