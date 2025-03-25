import Pusher from "pusher";

export default async function pushRank(req, res) {
  const { user_name, event_id } = req.body;
  try {
    const pusher = new Pusher({
      appId: "1962287",
      key: "0132420e244b16986c33",
      secret: "9f6725d8d14575964ce5",
      cluster: "ap3",
      useTLS: true,
    });

    await pusher.trigger(event_id, "rank_done", {
      user_name,
    });

    res.json();
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
}
