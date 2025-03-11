"use client";

import AddNewGameSection from "@/components/Pocket/AddNewGameSection";
import GameCard from "@/components/Pocket/GameCard";
import useDeletePocketGame from "@/hooks/pocket/useDeletePocketGame";
import useUpdatePocketGame from "@/hooks/pocket/useUpdatePocketGame";
import { toast } from "sonner";
import useSWR from "swr";

function GamesSection({ games, pocketId }) {
  const { data, mutate } = useSWR(`/pocket/${pocketId}/games`, null, {
    fallbackData: games,
    keepPreviousData: true,
  });

  return (
    <div className="flex flex-col gap-4">
      {data?.map(({ game, comment, _id }, index) => (
        <UpdateGameWrapper
          pocketGameId={_id}
          index={index}
          key={_id}
          game={game}
          comment={comment}
          afterDelete={({ pocketGameId }) => {
            mutate(current => current.filter(pocketGame => pocketGame._id !== pocketGameId), {
              optimisticData: true,
            });
          }}
          afterUpdate={() => {
            mutate(undefined, {
              revalidate: true,
            });
          }}
        />
      ))}

      <AddNewGameSection
        pocketId={pocketId}
        afterAddGame={newGame => {
          mutate(current => [...current, newGame], {
            optimisticData: true,
          });
        }}
      />
    </div>
  );
}

function UpdateGameWrapper(props) {
  const { updatePocketGame } = useUpdatePocketGame({ pocketGameId: props.pocketGameId });
  const { deletePocketGame } = useDeletePocketGame({ pocketGameId: props.pocketGameId });

  const onUpdate = async ({ game, comment }) => {
    try {
      await updatePocketGame({ gameId: game._id, comment });
      toast.success("更新成功！");
      props.afterUpdate();
    } catch {
      toast.error("更新遊戲發生錯誤，請稍後再試");
    }
  };

  const onDelete = async () => {
    try {
      await deletePocketGame();
      toast.success("刪除成功！");
      props.afterDelete({ pocketGameId: props.pocketGameId });
    } catch {
      toast.error("刪除遊戲發生錯誤，請稍後再試");
    }
  };

  return <GameCard {...props} onSubmit={onUpdate} onDelete={onDelete} />;
}

export default GamesSection;
