import useSWR from 'swr';

export function useEventGames(eventId) {
  const { data, error, isLoading } = useSWR(
    eventId ? `https://api.banfan.app/event/${eventId}/games` : null
  );

  return {
    games: data?.games || [], // 返回 games 陣列
    isLoading,
    error,
  };
}
