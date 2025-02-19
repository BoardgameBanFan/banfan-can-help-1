'use client';

import { SWRConfig } from 'swr';

const fetcher = async url => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error('API request failed');
    error.status = res.status;
    error.info = await res.json();
    throw error;
  }

  return res.json();
};

export function SWRProvider({ children }) {
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
      }}
    >
      {children}
    </SWRConfig>
  );
}

export { fetcher };
