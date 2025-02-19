/**
 * User Hook 示例
 * 展示如何使用 SWR 進行數據獲取
 *
 * 使用方式：
 * const { user, isLoading, error } = useUser(userId);
 */

import useSWR from 'swr';
import { fetcher } from '@/lib/swr-config';

export function useUser(userId) {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? `/api/users/${userId}` : null,
    fetcher
  );

  return {
    user: data,
    isLoading,
    error,
    mutate, // 用於手動重新驗證數據
  };
}
