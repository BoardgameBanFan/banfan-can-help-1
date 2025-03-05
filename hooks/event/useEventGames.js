import useSWR from 'swr';

export function useEventGames(eventId) {
  const { data, error, isLoading } = useSWR(
    eventId ? `https://api.banfan.app/events/${eventId}/games` : null
  );

  return {
    data: data || [], // 返回空陣列作為默認值
    isLoading,
    error,
  };
}
