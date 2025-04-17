import useSWRMutation from "swr/mutation";

async function sendRequest(url, { gameId, user_name, email, is_interested }) {
  return fetch(`${url}/${gameId}/vote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      is_interested,
      email,
      name: user_name,
    },
  }).then(res => res.json());
}

export default function useVoteGame({ eventId }) {
  const { trigger, data, error, isMutating } = useSWRMutation(
    `/event/${eventId}/games`,
    sendRequest
  );
  return { trigger, data, error, isMutating };
}
