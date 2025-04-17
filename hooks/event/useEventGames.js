import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import { BASE_URL } from "@/constants/api";

export function useEventGames(eventId) {
  const { data, error, isLoading, mutate, isValidating } = useSWR(
    eventId ? `${BASE_URL}/events/${eventId}/games` : null,
    fetcher
  );

  return {
    data: data || [], // 返回空陣列作為默認值
    isLoading,
    isValidating,
    error,
    mutate,
  };
}
