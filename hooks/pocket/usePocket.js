import makeFetcher from "@/utils/makeFetcher";
import useSWRMutation from "swr/mutation";

function usePocket() {
  const { trigger: createPocket } = useSWRMutation("/pocket", makeFetcher("POST"));

  return {
    createPocket,
  };
}

export default usePocket;
