"use client";
import { useState } from "react";
import { mutate } from "swr";
import { BASE_URL } from "@/constants/api";

interface VoteGameParams {
  eventId: string;
  gameId: string;
  isInterested: boolean;
  email: string;
  name: string;
}

export function useVoteGame() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const voteGame = async ({ eventId, gameId, isInterested, email, name }: VoteGameParams): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/events/${eventId}/games/${gameId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_interested: isInterested,
          email,
          name,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to vote');
      }

      // 投票成功後重新獲取遊戲列表
      await mutate(`${BASE_URL}/events/${eventId}/games`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '投票失敗';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    voteGame,
    isLoading,
    error,
  };
}
