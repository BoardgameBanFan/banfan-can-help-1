"use client";
import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Calendar, MapPin, Users, Loader2, Plus } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { GameItemCard } from "@/components/GameItemCard";
import { useEvent, useEventGames } from "@/hooks/event";
import StoriesCardList from "@/components/StoriesCardList";
import UserQuickInfoModal from "@/components/UserQuickInfoModal";
import { useTranslations } from "next-intl";

import useUserStore from "@/stores/useUserStore";
import useMobileResponsiveVh from "@/hooks/useMobileResponsiveVh";

function LoadingState() {
  return (
    <div className="space-y-4">
      <BackButton onClick={undefined} />
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-6 h-6 text-[#2E6999] animate-spin" />
      </div>
    </div>
  );
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

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
}

export default function EventDetailPage() {
  const params = useParams();
  const userEmail = useUserStore(state => state.email);
  const [isOpenStoriesCardList, setIsOpenStoriesCardList] = useState(false);
  const [initialFocusId, setInitialFocusId] = useState(false);
  useMobileResponsiveVh();
  const handleClickVote = useCallback(e => {
    console.log(e.target, e.target.dataset.id);
    setInitialFocusId(e.target.dataset.id);
    setIsOpenStoriesCardList(true);
  }, []);
  const t = useTranslations();

  // Data fetching hooks
  const { data: event, isLoading: eventLoading } = useEvent(params.id as string);
  const { data: games, isLoading: gamesLoading } = useEventGames(params.id as string);

  // Loading state
  if (eventLoading || gamesLoading) {
    return <LoadingState />;
  }

  // Error state
  if (!event || !games) {
    return null;
  }

  if (eventLoading || gamesLoading) return <LoadingState />;
  if (!event || !games) return null;

  const isEventFull = event.attendees?.length >= event.max_players;
  const isEventHost = event.host_by?._id === "TODO: 當前用戶ID";
  const hasJoined = event.attendees?.some(attendee => attendee._id === "TODO: 當前用戶ID");
  const isEventEnded = new Date(event.host_at) < new Date();
  const canVote = true;
  const canAddGame = event.is_game_addable ?? true;

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
      className: "bg-[#2E6999] hover:bg-[#245780] text-white",
    };
  };

  return (
    <>
      <div className="h-auto pb-8 w-f bg-[#F5F5F5] rounded-lg overflow-hidden">
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
          {/* Host information - commented out
          <p className="text-gray-700 mb-4">Host by {event.host_by?.username}</p>
          */}

          <div className="space-y-3 mb-5">
            {/*<div className="flex items-center">*/}
            {/*  <div className="w-6 h-6 mr-3 flex-shrink-0">*/}
            {/*    <Calendar className="w-6 h-6 text-gray-700" />*/}
            {/*  </div>*/}
            {/*  <span className="text-gray-700">{formatDate(event.host_at)}</span>*/}
            {/*</div>*/}

            {/* Location information - commented out
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
            */}

            {/* Attendee count - commented out
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
            */}
          </div>

          {/* Game List */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">
                Game List
                {games && <span className="text-gray-500 text-base ml-1">({games.length})</span>}
              </h2>
            </div>

            {canAddGame && (
              <div className="flex justify-center mb-4">
                <Link
                  href={`/event/create/search-game?returnTo=/event/${params.id}`}
                  className="bg-[#2E6999] hover:bg-[#245780] text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors duration-200"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add game
                </Link>
              </div>
            )}

            {/* Vote until date - commented out
            <ul className="list-disc pl-5 text-gray-700 mb-3">
              {canVote && <li>Vote opened until {formatDate(event.host_at)}</li>}
            </ul>
            */}

            {games && games.length > 0 ? (
              <div className="space-y-2.5 mt-3">
                {games.map(game => (
                  <GameItemCard
                    key={game._id}
                    gameWithAddUser={game}
                    mode="event"
                    canVote={canVote}
                    handleClickVote={handleClickVote}
                    userEmail={userEmail}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 p-4 bg-white rounded-lg shadow-sm">
                {t("No games added yet")}
              </div>
            )}
          </div>
        </div>
      </div>

      {isOpenStoriesCardList && (
        <StoriesCardList
          isOpen={isOpenStoriesCardList}
          setIsOpen={setIsOpenStoriesCardList}
          eventId={params.id}
          initialFocusId={initialFocusId}
          gameList={games}
        />
      )}

      <UserQuickInfoModal mode="email" />
    </>
  );
}
