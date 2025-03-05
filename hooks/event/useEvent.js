import useSWR from 'swr';

export function useEvent(eventId) {
  const { data, error, isLoading } = useSWR(
    eventId ? `https://api.banfan.app/events/${eventId}` : null
  );

  return {
    data,
    isLoading,
    error,
  };
}
