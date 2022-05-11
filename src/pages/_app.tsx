import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux';
import { store } from '../stores';

import AppLayout from '../components/AppLayout'

// Add ethereum property to Global window object.
declare global {
  interface Window {
    ethereum: {
      request<T>(params: { method: string }): Promise<T>;
      on<T>(event: string, cb: (params: T) => void): void;
      removeListener<T>(event: string, cb: (params: T) => void): void;
      selectedAddress: string | undefined;
    };
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <AppLayout>
        <Component {...pageProps} />
      </AppLayout>
    </Provider>
  )
}

export default MyApp
