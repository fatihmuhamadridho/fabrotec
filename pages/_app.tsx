import '@styles/tailwind.css';
import '@mantine/core/styles.css';
import '@styles/globals.scss';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppProps, NextWebVitalsMetric } from 'next/app';
import Head from 'next/head';
import React from 'react';
import { createTheme, MantineProvider } from '@mantine/core';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 20,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      retry: false,
    },
  },
});

const theme = createTheme({});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <React.Fragment>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <MantineProvider theme={theme}>
          <main className="appMain">
            <Component {...pageProps} />
          </main>
        </MantineProvider>
      </QueryClientProvider>
    </React.Fragment>
  );
}

export function reportWebVitals(metric: NextWebVitalsMetric) {
  const body = JSON.stringify(metric);

  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/vitals', body);
    return;
  }

  void fetch('/api/vitals', {
    body,
    method: 'POST',
    keepalive: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
