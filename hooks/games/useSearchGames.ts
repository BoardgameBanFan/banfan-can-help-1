"use client";
import objToQueryString from "@/utils/objToQueryString";
import useSWR from "swr";
import { useState, useCallback } from "react";

interface Game {
  _id: string;
  bgg_id: string;
  name: string;
  description: string;
  image: string;
  thumbnail: string;
  min_player: number;
  max_player: number;
  year_published: number;
  rating: number;
  search_name: string;
  users_rated: number;
}

interface SearchResult {
  count: number;
  data: Game[];
}

interface UseSearchGamesProps {
  keyword?: string;
  page?: number;
  gamePerPage?: number;
}

interface FormattedGame {
  id: string;
  name: string;
  year: number;
  thumbnail: string;
  image: string;
  description: string;
  minPlayers: number;
  maxPlayers: number;
  bggId: string;
  rating: number;
  searchName: string;
  usersRated: number;
  names: Array<{
    language: string;
    value: string;
  }>;
}

const BASE_URL = "https://api.banfan.app";

// 自定義 fetcher 函數
const fetcher = async (url: string) => {
  console.log('Fetching:', url); // 調試日誌
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`);
  }
  const data = await response.json();
  console.log('Response:', data); // 調試日誌
  return data;
};

export interface UseSearchGamesReturn {
  isLoading: boolean;
  games: FormattedGame[];
  searchResults: FormattedGame[];
  count: number;
  totalPage: number;
  searchGames: (query: string) => void;
  error?: string;
}

export function useSearchGames({ 
  keyword = "", 
  page = 0, 
  gamePerPage = 10 
}: UseSearchGamesProps = {}) {
  const [searchKeyword, setSearchKeyword] = useState(keyword);
  
  const url = searchKeyword && searchKeyword.length >= 2
    ? `${BASE_URL}/games/search/${encodeURIComponent(searchKeyword)}${objToQueryString({
        limit: gamePerPage,
        offset: page * gamePerPage,
      })}`
    : null;

  const { data, error, isLoading } = useSWR<SearchResult>(
    url,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 2000,
    }
  );

  // 將 API 返回的遊戲資料轉換為 Autocomplete 需要的格式
  const formatGames = useCallback((games: Game[] = []): FormattedGame[] => {
    return games.map(game => ({
      id: game._id,
      name: game.name,
      year: game.year_published,
      thumbnail: game.thumbnail,
      image: game.image,
      description: game.description,
      minPlayers: game.min_player,
      maxPlayers: game.max_player,
      bggId: game.bgg_id,
      rating: game.rating,
      searchName: game.search_name,
      usersRated: game.users_rated,
      names: [
        {
          language: "primary",
          value: game.name
        },
        ...(game.search_name?.split(/(?=[A-Z])|[,\n]/)
          .map(name => name.trim())
          .filter(name => name && name !== game.name)
          .map(name => ({
            language: "alternate",
            value: name
          })) || [])
      ]
    }));
  }, []);

  // 用於 Autocomplete 的搜尋方法
  const searchGames = useCallback((query: string) => {
    console.log('Search query:', query); // 調試日誌
    if (!query || query.length < 2) {
      setSearchKeyword("");
      return;
    }
    setSearchKeyword(query);
  }, []);

  const formattedGames = formatGames(data?.data);

  return {
    isLoading,
    games: formattedGames,
    searchResults: formattedGames,
    count: data?.count || 0,
    totalPage: Math.ceil((data?.count || 0) / gamePerPage),
    searchGames,
    error: error?.message,
  };
}

export default useSearchGames;
