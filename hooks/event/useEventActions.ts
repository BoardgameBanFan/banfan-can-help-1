"use client";
import { useState } from "react";

interface CreateEventData {
  title: string;
  address: string;
  host_at: string;
  min_players?: number;
  max_players?: number;
  fee?: number;
  vote_end_at?: string;
}

interface AddGameData {
  game_id: string;
  add_by: string;
  comment?: string;
}

interface ApiError {
  error?: string;
  message?: string;
}


const BASE_URL = "https://api.banfan.app";

export function useEventActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createEvent = async (data: CreateEventData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = (result as ApiError).error ||
                           (result as ApiError).message ||
                           `Failed to create event: ${response.status}`;
        throw new Error(errorMessage);
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '建立活動失敗';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const addGameToEvent = async (eventId: string, data: AddGameData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/events/${eventId}/addGame`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        // 處理 API 錯誤回應
        const errorMessage = (result as ApiError).error ||
                           (result as ApiError).message ||
                           `Failed to add game: ${response.status}`;
        throw new Error(errorMessage);
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '新增遊戲失敗';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createEvent,
    addGameToEvent,
    isLoading,
    error,
  };
}
