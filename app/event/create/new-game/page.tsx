"use client";
import { useRouter, useSearchParams } from "next/navigation";
import useEventStore from "@/stores/useEventStore";
import { useEventActions } from "@/hooks/event/useEventActions";
import { GameForm } from "@/components/GameForm";

export default function AddGamePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addGame } = useEventStore();
  const { addGameToEvent } = useEventActions();

  // 從 URL 獲取參數
  const gameParam = searchParams.get("game");
  const returnTo = searchParams.get("returnTo");
  const eventId = returnTo?.match(/\/event\/([^/]+)/)?.[1];

  if (!gameParam) {
    router.push("/event/create/search-game");
    return null;
  }

  let selectedGame;
  try {
    selectedGame = JSON.parse(decodeURIComponent(gameParam));
  } catch (error) {
    console.error("Error parsing game data:", error);
    router.push("/event/create/search-game");
    return null;
  }

  const handleSubmit = async gameData => {
    try {
      if (eventId) {
        // 如果是從活動頁面來的，使用 addGameToEvent API
        await addGameToEvent(eventId, gameData);
        router.push(returnTo);
      } else {
        // 如果是從創建活動頁面來的，使用 store
        addGame(gameData);
        router.push("/event/create");
      }
    } catch (error) {
      console.error("Error submitting game:", error);
      alert("Failed to add game");
    }
  };

  const backPath = returnTo
    ? `/event/create/search-game?returnTo=${encodeURIComponent(returnTo)}`
    : "/event/create/search-game";

  const cancelPath = returnTo || "/event/create";

  return (
    <GameForm
      game={selectedGame}
      onSubmit={handleSubmit}
      backPath={backPath}
      cancelPath={cancelPath}
      includeGameData={!eventId}
    />
  );
}
