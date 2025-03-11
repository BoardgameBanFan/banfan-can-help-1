"use client";

import AddNewGameSection from "@/components/Pocket/AddNewGameSection";
import GameCard from "@/components/Pocket/GameCard";
import useSWR from "swr";

function GamesSection({ games, pocketId }) {
  const { data, mutate } = useSWR(`/pocket/${pocketId}/games`, null, {
    fallbackData: games,
  });

  return (
    <div className="flex flex-col gap-4">
      {data?.map(({ game, comment, _id }, index) => (
        <GameCard index={index} key={_id} game={game} comment={comment} />
      ))}

      <AddNewGameSection
        pocketId={pocketId}
        afterAddGame={() => {
          mutate(undefined, {
            revalidate: true,
          });
        }}
      />
    </div>
  );
}

export default GamesSection;
