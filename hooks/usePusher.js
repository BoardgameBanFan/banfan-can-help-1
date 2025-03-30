import { useEffect } from "react";
import Pusher from "pusher-js";

import useVenueStore from "@/stores/useVenueStore.js";

export default function usePusher({ isActivate, event_id }) {
  useEffect(() => {
    if (!isActivate) return;

    const pusher = new Pusher("0132420e244b16986c33", {
      cluster: "ap3",
    });

    const channel = pusher.subscribe(event_id);

    channel.bind("rank_done", ({ user_name, finish_number, isSubmit }) => {
      useVenueStore.getState().addRankReadyUserName(user_name, finish_number, isSubmit);
    });

    return () => {};
  }, [isActivate, event_id]);

  return;
}
