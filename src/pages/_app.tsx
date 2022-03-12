import type { AppProps } from 'next/app';
import Head from 'next/head';
import { SWRConfig } from 'swr';

import { fetcher } from '_utils';

import 'antd/dist/antd.css';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>Instagram Followers Analytics</title>
        <meta
          name="description"
          content="Find out which of your Instagram followers, has the most followers"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SWRConfig value={{ fetcher }}>
        <Component {...pageProps} />
      </SWRConfig>
    </>
  );
};

export default MyApp;
