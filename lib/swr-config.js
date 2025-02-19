'use client';

import { SWRConfig } from 'swr';

/**
 * SWR 全局配置
 * 這個文件設置 SWR 的默認行為和配置
 */

// 基本的 fetcher 函數
const fetcher = async url => {
  const res = await fetch(url);

  // 如果請求失敗，拋出錯誤
  if (!res.ok) {
    const error = new Error('API request failed');
    error.status = res.status;
    error.info = await res.json();
    throw error;
  }

  return res.json();
};

// SWR Provider 組件
export function SWRProvider({ children }) {
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: true, // 當視窗重新獲得焦點時重新驗證
        revalidateOnReconnect: true, // 重新連接時重新驗證
        refreshInterval: 0, // 自動重新驗證間隔（0 表示禁用）
        shouldRetryOnError: true, // 錯誤時重試
        dedupingInterval: 2000, // 去重間隔
        errorRetryCount: 3, // 錯誤重試次數
      }}
    >
      {children}
    </SWRConfig>
  );
}

// 導出 fetcher 供單獨使用
export { fetcher };
