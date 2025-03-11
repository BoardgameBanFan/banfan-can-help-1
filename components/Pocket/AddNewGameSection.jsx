import GameCard from "@/components/Pocket/GameCard";
import SelectGameDrawer from "@/components/Pocket/SelectGameDrawer";
import { Button } from "@/components/ui/button";
import useAddGameToPocket from "@/hooks/pocket/useAddGameToPocket";
import { Dices } from "lucide-react";
import { useState } from "react";

function AddNewGameSection({ pocketId, afterAddGame = () => {} }) {
  const [game, setGame] = useState(null);
  const { addGameToPocket } = useAddGameToPocket({ pocketId });

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
        game={game}
        comment=""
        initialEditMode
        onCancel={() => setGame(null)}
        onSubmit={onAddGame}
      />
    );
  }

  return (
    <SelectGameDrawer
      onGameSelected={setGame}
      triggerComponent={
        <Button variant="outline" className="w-full">
          <Dices />
          新增遊戲
        </Button>
      }
    />
  );
}

export default AddNewGameSection;
