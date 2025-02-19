import useSWR from 'swr';

export function useEvent(eventId) {
  const { data, error, isLoading } = useSWR(
    eventId ? `https://api.banfan.app/event/${eventId}` : null
  );

  return {
    event: data,
    isLoading,
    error,
  };
}
