import useSWR from "swr";
import fetcher from "@/utils/fetcher";

export function useEventGames(eventId) {
  const { data, error, isLoading } = useSWR(
    eventId ? `https://api.banfan.app/events/${eventId}/games` : null,
    fetcher
  );

  return {
    data: data || [], // 返回空陣列作為默認值
    isLoading,
    error,
  };
}
