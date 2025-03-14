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

interface CreateEventResponse {
  _id: string;
}

interface AddGameData {
  game_id: string;  // 改回 game_id
  add_by: string;
  comment: string;  // 必填
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

      // 返回創建的活動 ID
      return (result as CreateEventResponse)._id;
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
        body: JSON.stringify({
          game_id: data.game_id,
          add_by: data.add_by,
          comment: data.comment || "推薦遊戲", // 如果沒有提供 comment，使用預設值
        }),
      });
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
