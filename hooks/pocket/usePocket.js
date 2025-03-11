import makeFetcher from "@/utils/makeFetcher";
import useSWRMutation from "swr/mutation";

function usePocket() {
  const { trigger: createTrigger } = useSWRMutation("/pocket", makeFetcher("POST"));

  const createPocket = async ({ title, description, canAdd, canComment }) => {
    await createTrigger({
      title,
      description,
      can_add: canAdd,
      can_comment: canComment,
    });
  };

  return {
    createPocket,
  };
}

export default usePocket;
