import useSWR from "swr";
import fetcher from "@/utils/fetcher";

export function useEvent(eventId) {
  const { data, error, isLoading } = useSWR(
    eventId ? `https://api.banfan.app/events/${eventId}` : null,
    fetcher
  );

  return {
    data,
    isLoading,
    error,
  };
}
