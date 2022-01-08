import 'bootstrap/dist/css/bootstrap.css';
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { EthereumProvider } from '../context/EthereumContext';

declare global {
  interface Window { ethereum: any }
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <EthereumProvider>
      <Component {...pageProps} />
    </EthereumProvider>
  )
}

export default MyApp
