import { useSelectGameDrawerStore } from "@/app/pocket/layout";
import GameCard from "@/components/Pocket/GameCard";
import { Button } from "@/components/ui/button";
import useAddGameToPocket from "@/hooks/pocket/useAddGameToPocket";
import { Dices } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

function AddNewGameSection({ pocketId, afterAddGame = () => {} }) {
  const [game, setGame] = useState(null);
  const { addGameToPocket } = useAddGameToPocket({ pocketId });
  const setSelectGameFunc = useSelectGameDrawerStore(state => state.setSelectGameFunc);

  const onAddGame = async ({ gameId, comment }) => {
    try {
      await addGameToPocket({ gameId, comment });
      afterAddGame();
      setGame(null);
    } catch (error) {
      console.error(error);
    }
  };

  if (game) {
    return (
      <GameCard
        focusOnMount
        game={game}
        comment=""
        initialEditMode
        onCancel={() => setGame(null)}
        onSubmit={onAddGame}
      />
    );
  }

  return (
    <div className="flex gap-4 fixed left-1/2 -translate-x-1/2 bottom-0 bg-white max-w-[480px] w-full p-4 rounded-md">
      <Link href="/pocket" className="w-full">
        <Button variant="secondary" className="w-full">
          回列表
        </Button>
      </Link>

      <Button
        className="w-full"
        onClick={() =>
          setSelectGameFunc(game => {
            setGame(game);
          })
        }
      >
        <Dices />
        新增遊戲
      </Button>
    </div>
  );
}

export default AddNewGameSection;
