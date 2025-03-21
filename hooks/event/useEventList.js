import useSWR from "swr";

// Define the fetcher function for SWR
const fetcher = url =>
  fetch(url).then(res => {
    if (!res.ok) throw new Error("Failed to fetch data");
    return res.json();
  });

export function useEventList() {
  const { data, error, isLoading } = useSWR("https://api.banfan.app/events", fetcher);

  return {
    events: data,
    isLoading,
    error,
  };
}
