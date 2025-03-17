"use client";
import { useParams } from "next/navigation";
import { useEventDetails } from "@/hooks/event/useEventDetails";
import { useUser } from "@/hooks/useUser";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import GroupIcon from "@mui/icons-material/Group";
import { useState } from "react";

export default function VenuePage() {
  const params = useParams();
  const { user } = useUser();
  const { event, games, isLoading, error, joinGame, leaveGame } = useEventDetails(
    params.id as string
  );
  const [joiningGame, setJoiningGame] = useState<string | null>(null);

  const handleJoinGame = async (gameId: string) => {
    if (!user) {
      alert("請先登入");
      return;
    }

    try {
      setJoiningGame(gameId);
      await joinGame(gameId, user.id, user.name);
    } catch (err) {
      console.error("Failed to join game:", err);
      alert("加入遊戲失敗");
    } finally {
      setJoiningGame(null);
    }
  };

  const handleLeaveGame = async (gameId: string) => {
    if (!user) return;

    try {
      setJoiningGame(gameId);
      await leaveGame(gameId, user.id);
    } catch (err) {
      console.error("Failed to leave game:", err);
      alert("退出遊戲失敗");
    } finally {
      setJoiningGame(null);
    }
  };

  const isUserJoinedGame = (game: any) => {
    return game.players?.some((player: any) => player.user_id === user?.id);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-500">載入失敗: {error}</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="p-6">
        <div className="text-gray-500">找不到活動</div>
      </div>
    );
  }

  const eventDate = new Date(event.host_at);
  const formattedDate = eventDate.toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
  const formattedTime = eventDate.toLocaleTimeString("zh-TW", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">{event.title}</h1>

      <div className="space-y-4">
        <div className="bg-white rounded-lg p-4 flex items-center space-x-3">
          <AccessTimeIcon className="text-gray-600" />
          <div>
            <div className="font-medium">{formattedDate}</div>
            <div className="text-gray-600">{formattedTime}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 flex items-center space-x-3">
          <LocationOnIcon className="text-gray-600" />
          <div>
            <div className="font-medium">{event.address}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 flex items-center space-x-3">
          <GroupIcon className="text-gray-600" />
          <div>
            <div className="font-medium">
              {event.min_players} - {event.max_players} 人
            </div>
            {event.fee > 0 && <div className="text-gray-600">費用：${event.fee}</div>}
          </div>
        </div>

        {games && games.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">遊戲列表</h2>
            <div className="space-y-4">
              {games.map(gameItem => (
                <div key={gameItem.game_id} className="bg-white rounded-lg p-4">
                  <div className="flex items-start space-x-4">
                    {gameItem.game.thumbnail && (
                      <img
                        src={gameItem.game.thumbnail}
                        alt={gameItem.game.name}
                        className="w-24 h-24 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">{gameItem.game.name}</h3>
                          <p className="text-sm text-gray-600">
                            {gameItem.game.min_player}-{gameItem.game.max_player} 人 •{" "}
                            {gameItem.game.year_published}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            isUserJoinedGame(gameItem)
                              ? handleLeaveGame(gameItem.game_id)
                              : handleJoinGame(gameItem.game_id)
                          }
                          disabled={joiningGame === gameItem.game_id}
                          className={`px-4 py-2 rounded-full text-sm ${
                            isUserJoinedGame(gameItem)
                              ? "bg-red-500 text-white hover:bg-red-600"
                              : "bg-blue-500 text-white hover:bg-blue-600"
                          } ${joiningGame === gameItem.game_id ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          {joiningGame === gameItem.game_id
                            ? "處理中..."
                            : isUserJoinedGame(gameItem)
                              ? "退出"
                              : "參加"}
                        </button>
                      </div>
                      {gameItem.comment && (
                        <p className="text-sm text-gray-600 mt-2">{gameItem.comment}</p>
                      )}
                      <div className="mt-3">
                        <p className="text-sm text-gray-500">推薦者：{gameItem.add_by}</p>
                        {gameItem.players && gameItem.players.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium">參與者：</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {gameItem.players.map(player => (
                                <span
                                  key={player.user_id}
                                  className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                                >
                                  {player.user_name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function UIPage() {
  return (
    <div id="webcrumbs">
      <div className="w-[375px] bg-stone-100 p-6 font-sans">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">BanFan Day</h1>
          <div className="bg-white p-2 rounded-lg shadow-sm hover:bg-gray-50 transition-colors cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </div>
        </div>

        <div className="space-y-8">
          {/* First Game Card */}
          <div className="flex gap-4">
            <img
              src="https://i.imgur.com/T0FCQxR.png"
              alt="Scout Game"
              className="w-20 h-28 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h2 className="font-bold text-lg">Scout</h2>
              <p className="text-sm mb-2">
                Poach your opponents' artists and outdo each other's circus shows
              </p>
              <div className="flex gap-2 text-xs mb-2">
                <span>20 Mins</span>
                <span className="mx-2">•</span>
                <span>Weight: 1.36 / 5</span>
              </div>
              <span className="text-xs text-gray-600">#FAMILY</span>

              <div className="flex mt-2 gap-2">
                <div className="bg-white rounded-full px-3 py-1 flex items-center gap-1 text-sm shadow-sm hover:shadow transition-shadow">
                  <img
                    src="https://i.imgur.com/jN8x0J6.png"
                    alt="James"
                    className="w-5 h-5 rounded-full"
                  />
                  <span>James</span>
                </div>
                <div className="bg-white rounded-full px-3 py-1 flex items-center gap-1 text-sm shadow-sm hover:shadow transition-shadow">
                  <img
                    src="https://i.imgur.com/wPFYZKL.png"
                    alt="Kuan"
                    className="w-5 h-5 rounded-full"
                  />
                  <span>Kuan</span>
                </div>
                <div className="bg-white rounded-full px-3 py-1 flex items-center gap-1 text-sm shadow-sm hover:shadow transition-shadow">
                  <img
                    src="https://i.imgur.com/7Rmzbdy.png"
                    alt="Lance"
                    className="w-5 h-5 rounded-full"
                  />
                  <span>Lance</span>
                </div>
              </div>
              <div className="flex mt-2 gap-2">
                <div className="bg-white rounded-full px-3 py-1 flex items-center gap-1 text-sm shadow-sm hover:shadow transition-shadow">
                  <img
                    src="https://i.imgur.com/qY6ygQR.png"
                    alt="Tiv"
                    className="w-5 h-5 rounded-full"
                  />
                  <span>Tiv</span>
                </div>
                <div className="bg-white rounded-full px-3 py-1 flex items-center gap-1 text-sm shadow-sm hover:shadow transition-shadow">
                  <img
                    src="https://i.imgur.com/hGDkeXL.png"
                    alt="Gore"
                    className="w-5 h-5 rounded-full"
                  />
                  <span>Gore</span>
                </div>
              </div>
            </div>
          </div>

          {/* Second Game Card */}
          <div className="flex gap-4">
            <img
              src="https://i.imgur.com/2BjyeoL.png"
              alt="Seasons Game"
              className="w-20 h-28 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h2 className="font-bold text-lg">Seasons</h2>
              <p className="text-sm mb-2">
                Mages compete across twelve seasons to collect crystals and become the new archmage.
              </p>
              <div className="flex gap-2 text-xs mb-2">
                <span>60 Mins</span>
                <span className="mx-2">•</span>
                <span>Weight: 2.78 / 5</span>
              </div>
              <span className="text-xs text-gray-600">#STRATEGY</span>

              <div className="flex mt-2 gap-2">
                <div className="bg-white rounded-full px-3 py-1 flex items-center gap-1 text-sm shadow-sm hover:shadow transition-shadow">
                  <img
                    src="https://i.imgur.com/jN8x0J6.png"
                    alt="James"
                    className="w-5 h-5 rounded-full"
                  />
                  <span>James</span>
                </div>
                <div className="bg-white rounded-full px-3 py-1 flex items-center gap-1 text-sm shadow-sm hover:shadow transition-shadow">
                  <img
                    src="https://i.imgur.com/wPFYZKL.png"
                    alt="Kuan"
                    className="w-5 h-5 rounded-full"
                  />
                  <span>Kuan</span>
                </div>
                <div className="bg-white rounded-full px-3 py-1 flex items-center gap-1 text-sm shadow-sm hover:shadow transition-shadow cursor-pointer hover:bg-gray-50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex mt-2 gap-2">
                <div className="bg-white rounded-full px-3 py-1 flex items-center gap-1 text-sm shadow-sm hover:shadow transition-shadow cursor-pointer hover:bg-gray-50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Third Game Card */}
          <div className="flex gap-4">
            <img
              src="https://i.imgur.com/sE4Hzpo.png"
              alt="Trickerion Game"
              className="w-20 h-28 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h2 className="font-bold text-lg">Trickerion: Collector's Edition</h2>
              <p className="text-sm mb-2">
                In a Victorian steampunk world, magicians perform dazzling tricks for money and
                fame.
              </p>
              <div className="flex gap-2 text-xs mb-2">
                <span>60-180 Mins</span>
                <span className="mx-2">•</span>
                <span>Weight: 4.53 / 5</span>
              </div>
              <span className="text-xs text-gray-600">#STRATEGY</span>

              <div className="flex mt-2 gap-2">
                <div className="bg-teal-500 text-white rounded-full px-3 py-1 flex items-center gap-1 text-sm shadow-sm hover:bg-teal-600 transition-colors">
                  <img
                    src="https://i.imgur.com/9wMX3QM.png"
                    alt="You"
                    className="w-5 h-5 rounded-full"
                  />
                  <span>You</span>
                </div>
                <div className="bg-white rounded-full px-3 py-1 flex items-center gap-1 text-sm shadow-sm hover:shadow transition-shadow">
                  <img
                    src="https://i.imgur.com/wPFYZKL.png"
                    alt="Kuan"
                    className="w-5 h-5 rounded-full"
                  />
                  <span>Kuan</span>
                </div>
                <div className="bg-white rounded-full px-3 py-1 flex items-center gap-1 text-sm shadow-sm hover:shadow transition-shadow cursor-pointer hover:bg-gray-50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex mt-2 gap-2">
                <div className="bg-white rounded-full px-3 py-1 flex items-center gap-1 text-sm shadow-sm hover:shadow transition-shadow cursor-pointer hover:bg-gray-50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
