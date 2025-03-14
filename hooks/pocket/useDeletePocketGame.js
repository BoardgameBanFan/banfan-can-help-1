import makeFetcher from "@/utils/makeFetcher";
import useSWRMutation from "swr/mutation";

function useDeletePocketGame({ pocketGameId }) {
  const { trigger: deletePocketGame } = useSWRMutation(
    `/pocket/${pocketGameId}`,
    makeFetcher("DELETE")
  );

  return {
    deletePocketGame,
  };
}

export default useDeletePocketGame;
