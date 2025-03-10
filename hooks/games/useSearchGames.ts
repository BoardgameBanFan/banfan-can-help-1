import objToQueryString from "@/utils/objToQueryString";
import useSWR from "swr";

function useSearchGames({ keyword = "", page = 0, gamePerPage = 10 }) {
  const url = keyword
    ? `/games/search/${keyword}${objToQueryString({
        limit: gamePerPage,
        offset: page * gamePerPage,
      })}`
    : undefined;

  const { data, isLoading } = useSWR(url);

  return {
    isLoading,
    games: data?.data || [],
    count: data?.count || 0,
    totalPage: Math.ceil(data?.count / gamePerPage),
  };
}

export default useSearchGames;
