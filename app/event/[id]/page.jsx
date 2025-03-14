"use client";

import { useEvent, useEventGames, useEventGameVote } from "@/hooks/event";
import { useParams } from "next/navigation";
import { Calendar, MapPin, Users, Loader2 } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { VoteModal } from "@/components/VoteModal";
import React from "react";

function LoadingState() {
  return (
    <div className="space-y-4">
      <BackButton />
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-6 h-6 text-[#2E6999] animate-spin" />
      </div>
    </div>
  );
}

export default function EventDetailPage() {
  const params = useParams();
  const { data: event, isLoading: eventLoading } = useEvent(params.id);
  const { data: games, isLoading: gamesLoading } = useEventGames(params.id);
  const { voteGame } = useEventGameVote();
  const [votingGameId, setVotingGameId] = React.useState(null);
  const [showVoteModal, setShowVoteModal] = React.useState(false);
  const [selectedGameId, setSelectedGameId] = React.useState(null);

  if (eventLoading || gamesLoading) return <LoadingState />;
  if (!event || !games) return null;

  const isEventFull = event.attendees?.length >= event.max_players;
  const isEventHost = event.host_by?._id === "TODO: 當前用戶ID";
  const hasJoined = event.attendees?.some(attendee => attendee._id === "TODO: 當前用戶ID");
  const isEventEnded = new Date(event.host_at) < new Date();
  const canVote = event.is_vote;
  const canAddGame = event.is_game_addable;

  const formatDate = dateString => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // 判斷是否為今天或明天
    if (date.toDateString() === today.toDateString()) {
      return `今天 ${date.toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `明天 ${date.toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" })}`;
    }

    return date.toLocaleString("zh-TW", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      weekday: "short",
    });
  };

  const getUserVoteStatus = voteBy => {
    const userInfo = localStorage.getItem("userVoteInfo");
    if (!userInfo) return null;

    const { email } = JSON.parse(userInfo);
    // 確保比對時使用小寫
    const userVote = voteBy?.find(vote => vote.email.toLowerCase() === email.toLowerCase());

    if (!userVote) return null;

    return {
      hasVoted: true,
      isInterested: userVote.is_interested,
    };
  };

  const handleVoteClick = gameId => {
    const userInfo = localStorage.getItem("userVoteInfo");
    if (userInfo) {
      // 如果已有用戶資料，直接投票
      handleVote(gameId, JSON.parse(userInfo));
    } else {
      // 如果沒有用戶資料，顯示 modal
      setSelectedGameId(gameId);
      setShowVoteModal(true);
    }
  };

  const handleVote = async (gameId, userInfo) => {
    setVotingGameId(gameId);
    try {
      const game = games.find(g => g._id === gameId);
      const currentVoteStatus = getUserVoteStatus(game.vote_by);

      await voteGame(params.id, gameId, {
        is_interested: currentVoteStatus ? !currentVoteStatus.isInterested : true, // 如果已投票，切換狀態
        email: userInfo.email,
        name: userInfo.name,
      });
    } catch (error) {
      console.error("Vote failed:", error);
    } finally {
      setVotingGameId(null);
    }
  };

  const handleVoteSubmit = formData => {
    setShowVoteModal(false);
    if (selectedGameId) {
      handleVote(selectedGameId, formData);
    }
  };

  const getButtonState = () => {
    if (isEventHost)
      return { text: "你是主辦人", disabled: true, className: "bg-gray-100 text-gray-500" };
    if (hasJoined)
      return { text: "已報名", disabled: true, className: "bg-green-50 text-green-600" };
    if (isEventFull)
      return { text: "人數已滿", disabled: true, className: "bg-gray-100 text-gray-500" };
    if (isEventEnded)
      return { text: "活動已結束", disabled: true, className: "bg-gray-100 text-gray-500" };
    return {
      text: "我要報名",
      disabled: false,
      className: "bg-blue-600 text-white hover:bg-blue-700",
    };
  };

  return (
    <div className="h-auto w-f bg-[#F5F5F5] rounded-lg overflow-hidden">
      {/* Header Image */}
      <div className="relative w-full h-[200px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
          alt="Board game"
          className="w-full h-full object-cover"
        />
        {canVote && (
          <div className="absolute bottom-0 left-0 right-0 bg-[#2E6999] py-2 px-4 text-white text-sm">
            Vote opened: vote the game you want to play!
          </div>
        )}
        <button className="absolute top-2 right-2 bg-black/30 hover:bg-black/50 p-1 rounded text-white transition-colors duration-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M16.192 6.344L11.949 10.586 7.707 6.344 6.293 7.758 10.535 12 6.293 16.242 7.707 17.656 11.949 13.414 16.192 17.656 17.606 16.242 13.364 12 17.606 7.758z" />
          </svg>
        </button>
      </div>

      {/* Event Details */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-2xl font-bold">{event.title}</h1>
          {isEventHost && (
            <button className="text-gray-600 px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors duration-200 text-sm">
              Edit
            </button>
          )}
        </div>
        <p className="text-gray-700 mb-4">Host by {event.host_by?.username}</p>

        <div className="space-y-3 mb-5">
          <div className="flex items-center">
            <div className="w-6 h-6 mr-3 flex-shrink-0">
              <Calendar className="w-6 h-6 text-gray-700" />
            </div>
            <span className="text-gray-700">{formatDate(event.host_at)}</span>
          </div>

          <div className="flex items-center">
            <div className="w-6 h-6 mr-3 flex-shrink-0">
              <MapPin className="w-6 h-6 text-gray-700" />
            </div>
            <span className="text-gray-700">
              {event.place?.Name}
              <br />
              {event.place?.Address}
            </span>
          </div>

          <div className="flex items-center">
            <div className="w-6 h-6 mr-3 flex-shrink-0">
              <Users className="w-6 h-6 text-gray-700" />
            </div>
            <div className="flex items-center">
              <span className="text-lg font-bold text-emerald-600 mr-2">
                {event.attendees?.length || 0}
              </span>
              <span className="text-gray-500">/ {event.max_players}</span>
              {!isEventFull && (
                <span className="ml-3 py-1 px-2 bg-emerald-500 text-white text-xs rounded">
                  Ready to go!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Game List */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">
              Game List
              {games && (
                <span className="text-gray-500 text-base ml-1">
                  ({games.reduce((total, game) => total + (game.vote_by?.length || 0), 0)})
                </span>
              )}
            </h2>
            {canAddGame && (
              <button className="text-[#2E6999] hover:text-[#245780] flex items-center transition-colors duration-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 mr-1"
                >
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                </svg>
                Add game
              </button>
            )}
          </div>

          <ul className="list-disc pl-5 text-gray-700 mb-3">
            {canAddGame && <li>Allow attendees add games</li>}
            {canVote && <li>Vote opened until {formatDate(event.host_at)}</li>}
          </ul>

          {games && games.length > 0 ? (
            <div className="space-y-2.5 mt-3">
              {games.map(({ _id, game, add_by, vote_by }) => {
                const voteStatus = getUserVoteStatus(vote_by);

                return (
                  <div key={_id} className="flex p-3 bg-white rounded-lg shadow-sm">
                    <div className="w-16 h-16 mr-3 bg-gray-100 rounded overflow-hidden">
                      <img
                        src={game.thumbnail}
                        alt={game.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{game.name}</h3>
                      <div className="text-xs text-gray-600 space-y-1">
                        <p className="line-clamp-2">{game.description}</p>
                        <p>
                          遊戲人數：{game.min_player}-{game.max_player} 人
                        </p>
                        <p className="text-gray-500">Nominated by {add_by}</p>
                        {vote_by && (
                          <div className="flex items-center gap-2">
                            <p className="text-gray-500">
                              {vote_by.length} vote{vote_by.length > 1 ? "s" : ""}
                              {vote_by.some(vote => vote.is_interested) && (
                                <span className="text-green-600 ml-1">
                                  ({vote_by.filter(vote => vote.is_interested).length} interested)
                                </span>
                              )}
                            </p>
                            {voteStatus && (
                              <span
                                className={`text-xs px-2 py-0.5 rounded ${
                                  voteStatus.isInterested
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {voteStatus.isInterested ? "有興趣" : "沒興趣"}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    {canVote && (
                      <button
                        className={`py-1 px-4 rounded self-center ml-2 transition-colors duration-200 ${
                          votingGameId === _id
                            ? "bg-gray-400 cursor-not-allowed"
                            : voteStatus
                              ? voteStatus.isInterested
                                ? "bg-green-500 hover:bg-green-600 text-white"
                                : "bg-gray-500 hover:bg-gray-600 text-white"
                              : "bg-[#2E6999] hover:bg-[#245780] text-white"
                        }`}
                        onClick={() => handleVoteClick(_id)}
                        disabled={votingGameId === _id}
                      >
                        {votingGameId === _id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : voteStatus ? (
                          voteStatus.isInterested ? (
                            "取消有興趣"
                          ) : (
                            "改為有興趣"
                          )
                        ) : (
                          "投票"
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-gray-500 p-4 bg-white rounded-lg shadow-sm">
              暫無遊戲
            </div>
          )}
        </div>

        {/* Join Button */}
        <div className="border-t pt-4">
          <button
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              getButtonState().disabled
                ? getButtonState().className
                : "bg-[#2E6999] hover:bg-[#245780] text-white"
            }`}
            onClick={() => {
              if (!getButtonState().disabled) {
                // TODO: 處理報名邏輯
                alert("報名功能開發中");
              }
            }}
            disabled={getButtonState().disabled}
          >
            {getButtonState().text}
          </button>
        </div>
      </div>

      {/* Vote Modal */}
      {showVoteModal && (
        <VoteModal
          onSubmit={handleVoteSubmit}
          onClose={() => {
            setShowVoteModal(false);
            setSelectedGameId(null);
          }}
        />
      )}
    </div>
  );
}
