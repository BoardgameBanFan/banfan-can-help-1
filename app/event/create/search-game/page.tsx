"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { GameSearch } from "@/components/GameSearch";

export default function SearchGamePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');

  const handleGameSelect = (selectedGame) => {
    const gameData = {
      id: selectedGame.id,
      bggId: selectedGame.bggId,
      name: selectedGame.name,
      thumbnail: selectedGame.thumbnail,
      image: selectedGame.image,
      minPlayers: selectedGame.minPlayers,
      maxPlayers: selectedGame.maxPlayers,
      description: selectedGame.description,
      year: selectedGame.year,
      rating: selectedGame.rating,
      usersRated: selectedGame.usersRated,
    };
    
    const queryString = encodeURIComponent(JSON.stringify(gameData));
    
    // 如果有 returnTo 參數，導航到該路徑，否則導航到 new-game 頁面
    if (returnTo) {
      router.push(`/event/create/new-game?game=${queryString}&returnTo=${encodeURIComponent(returnTo)}`);
    } else {
      router.push(`/event/create/new-game?game=${queryString}`);
    }
  };

  return (
    <GameSearch
      onGameSelect={handleGameSelect}
      returnPath={returnTo || "/event/create"}
      showBackButton
      backPath={returnTo || "/event/create"}
    />
  );
}
