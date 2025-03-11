import makeFetcher from "@/utils/makeFetcher";
import useSWRMutation from "swr/mutation";

function useAddGameToPocket({ pocketId }) {
  const { trigger: addGameTrigger } = useSWRMutation(
    `/pocket/${pocketId}/addGame`,
    makeFetcher("POST")
  );

  const addGameToPocket = async ({ gameId, comment }) => {
    return await addGameTrigger({
      game_id: gameId,
      comment,
    });
  };

  return {
    addGameToPocket,
  };
}

export default useAddGameToPocket;
