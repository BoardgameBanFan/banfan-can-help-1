"use client";
import useSWR from "swr";

interface Game {
  id: string;
  name: string;
  thumbnail: string;
  image: string;
  min_player: number;
  max_player: number;
  description: string;
  year_published: number;
  rating: number;
  players?: Array<{
    user_id: string;
    user_name: string;
  }>;
}

interface EventGame {
  game_id: string;
  add_by: string;
  comment?: string;
  game: Game;
  players: Array<{
    user_id: string;
    user_name: string;
  }>;
}

interface Event {
  id: string;
  title: string;
  address: string;
  host_at: string;
  min_players?: number;
  max_players?: number;
  fee?: number;
  vote_end_at?: string;
}

const BASE_URL = "https://api.banfan.app";

export function useEventDetails(eventId: string) {
  // 取得活動基本資訊
  const { 
    data: event, 
    error: eventError, 
    isLoading: eventLoading 
  } = useSWR<Event>(
    eventId ? `${BASE_URL}/events/${eventId}` : null
  );

  // 取得活動的遊戲列表
  const {
    data: games,
    error: gamesError,
    isLoading: gamesLoading,
    mutate: mutateGames
  } = useSWR<EventGame[]>(
    eventId ? `${BASE_URL}/events/${eventId}/games` : null
  );

  const joinGame = async (gameId: string, userId: string, userName: string) => {
    try {
      const response = await fetch(`${BASE_URL}/events/${eventId}/games/${gameId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          user_name: userName,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to join game');
      }

      // 只重新獲取遊戲列表
      mutateGames();
    } catch (err) {
      console.error('Error joining game:', err);
      throw err;
    }
  };

  const leaveGame = async (gameId: string, userId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/events/${eventId}/games/${gameId}/leave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to leave game');
      }

      // 只重新獲取遊戲列表
      mutateGames();
    } catch (err) {
      console.error('Error leaving game:', err);
      throw err;
    }
  };

  return {
    event,
    games,
    isLoading: eventLoading || gamesLoading,
    error: eventError?.message || gamesError?.message,
    joinGame,
    leaveGame,
  };
}
