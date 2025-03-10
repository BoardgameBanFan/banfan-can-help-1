"use client";

import makeFetcher from "@/utils/makeFetcher";
import { SWRConfig } from "swr";

export function SWRProvider({ children }) {
  return (
    <SWRConfig
      value={{
        fetcher: makeFetcher("GET"),
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        keepPreviousData: true,
      }}
    >
      {children}
    </SWRConfig>
  );
}
