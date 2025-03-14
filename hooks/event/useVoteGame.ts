"use client";
import { useState } from "react";
import { VoteResponse } from "@/types/event";

interface VoteGameParams {
  eventId: string;
  gameId: string;
  isInterested: boolean;
  email: string;
  name: string;
}

const BASE_URL = "https://api.banfan.app";

export function useVoteGame() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const voteGame = async ({ eventId, gameId, isInterested, email, name }: VoteGameParams): Promise<VoteResponse> => {
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

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to vote');
      }

      return result;
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
