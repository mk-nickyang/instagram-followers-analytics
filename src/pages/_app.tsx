import type { AppProps } from 'next/app';
import { SWRConfig } from 'swr';
import { ChakraProvider } from '@chakra-ui/react';

import { fetcher } from '_utils';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <SWRConfig value={{ fetcher }}>
        <Component {...pageProps} />
      </SWRConfig>
    </ChakraProvider>
  );
}

export default MyApp;
