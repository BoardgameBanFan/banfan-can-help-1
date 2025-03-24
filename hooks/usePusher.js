import { useEffect } from "react";
import Pusher from "pusher-js";

import useVenueStore from "@/store/useVenueStore.js";

export default function usePusher({ isActivate, event_id }) {
  useEffect(() => {
    if (!isActivate) return;

    const pusher = new Pusher("0132420e244b16986c33", {
      cluster: "ap3",
    });

    const channel = pusher.subscribe(event_id);

    channel.bind("rank_done", ({ user_name }) => {
      useVenueStore.getState().addRankReadyUser(user_name);
    });

    return () => {};
  }, []);

  return;
}
