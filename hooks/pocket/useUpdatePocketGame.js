import makeFetcher from "@/utils/makeFetcher";
import useSWRMutation from "swr/mutation";

function useUpdatePocketGame({ pocketGameId }) {
  const { trigger: updateGameTrigger } = useSWRMutation(
    `/pocket/${pocketGameId}`,
    makeFetcher("PATCH")
  );

  const updatePocketGame = async ({ gameId, comment }) => {
    await updateGameTrigger({
      game_id: gameId,
      comment,
    });
  };

  return {
    updatePocketGame,
  };
}

export default useUpdatePocketGame;
