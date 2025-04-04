"use client";
import { useState, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, LoaderCircle, Plus, QrCode } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { GameItemCard } from "@/components/GameItemCard";
import { useEvent, useEventGames } from "@/hooks/event";
import StoriesCardList from "@/components/StoriesCardList";
import UserQuickInfoModal from "@/components/UserQuickInfoModal";
import { QrCodeModal } from "@/components/QrCodeModal";
import { useTranslations } from "next-intl";
import { checkToken } from "@/app/actions/auth";
import GameSearchDialog from "@/components/GameSearchDialog/GameSearchDialog";

import useUserStore from "@/stores/useUserStore";
import useMobileResponsiveVh from "@/hooks/useMobileResponsiveVh";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEventActions } from "@/hooks/event/useEventActions";

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

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addGameToEvent } = useEventActions();
  const userEmail = useUserStore(state => state.email);
  const userName = useUserStore(state => state.name);
  const [isOpenStoriesCardList, setIsOpenStoriesCardList] = useState(false);
  const [initialFocusId, setInitialFocusId] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isQrCodeModalOpen, setIsQrCodeModalOpen] = useState(false);
  useMobileResponsiveVh();
  const handleClickVote = useCallback(e => {
    setInitialFocusId(e.target.dataset.id);
    setIsOpenStoriesCardList(true);
  }, []);
  const t = useTranslations();

  // Check authentication status
  useEffect(() => {
    const checkAuthentication = async () => {
      const isAuth = await checkToken();
      setIsAuthenticated(isAuth);
    };

    checkAuthentication();
  }, []);

  // Data fetching hooks
  const { data: event, isLoading: eventLoading } = useEvent(params.id as string);
  const {
    data: games,
    isLoading: gamesLoading,
    mutate,
    isValidating: isGameValidating,
  } = useEventGames(params.id as string);

  const onAddGameList = useCallback(
    async game => {
      try {
        await addGameToEvent(event._id, {
          game_id: game.id,
          add_by: userName,
          comment: "123",
        });

        mutate();
      } catch {
        toast("Failed to add game!");
      }
    },
    [addGameToEvent, event?._id, mutate, userName]
  );

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

  // Prepare game covers for the QR code modal
  const gameCovers = games.map(gameItem => ({
    thumbnail: gameItem.game.thumbnail,
    name: gameItem.game.name,
  }));

  // const isEventFull = event.attendees?.length >= event.max_players;
  const isEventHost = event.host_by?._id === "TODO: 當前用戶ID";
  // const hasJoined = event.attendees?.some(attendee => attendee._id === "TODO: 當前用戶ID");
  // const isEventEnded = new Date(event.host_at) < new Date();
  const canVote = true;
  // const canAddGame = event.is_game_addable ?? true;

  return (
    <>
      <div className="h-auto pb-4 bg-[#F5F5F5] rounded-lg overflow-hidden">
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
        <div className="pt-4">
          {/* Title area - with padding */}
          <div className="flex justify-between items-center mb-3 px-4">
            <div className="flex-1 mr-2">
              <h1 className="text-2xl font-bold">{event.title}</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => setIsQrCodeModalOpen(true)}
                className="text-gray-600 p-2 mr-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Share QR Code"
              >
                <QrCode />
              </button>

              {isEventHost && (
                <button className="text-gray-600 px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors duration-200 text-sm">
                  Edit
                </button>
              )}
            </div>
          </div>
          {/* Host information - commented out
          <p className="text-gray-700 mb-4">Host by {event.host_by?.username}</p>
          */}

          <div className="space-y-3 mb-5 px-4">
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
            {/* Game List heading - with padding */}
            <div className="flex justify-between items-center mb-2 px-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                Game List
                {games && <span className="text-gray-500">({games.length})</span>}
                {isGameValidating ? <LoaderCircle className="animate-spin" /> : null}
              </h2>
            </div>

            <div className="flex justify-center mb-4">
              <GameSearchDialog
                onGameConfirmed={onAddGameList}
                triggerElement={
                  <Button size="lg">
                    <Plus className="w-4 h-4 mr-1" />
                    Add game
                  </Button>
                }
              />
            </div>
            {/* Vote until date - commented out
            <ul className="list-disc pl-5 text-gray-700 mb-3">
              {canVote && <li>Vote opened until {formatDate(event.host_at)}</li>}
            </ul>
            */}

            {/* GameItemCard area - no horizontal padding */}
            {games && games.length > 0 ? (
              <div className="space-y-3 mt-3 px-4">
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
              <div className="text-center text-gray-500 p-4 mx-4 bg-white rounded-lg shadow-sm">
                {t("No games added yet")}
              </div>
            )}

            {isGameValidating ? (
              <LoaderCircle className="animate-spin mx-auto mt-4" size={30} />
            ) : null}

            <div className="flex justify-center mt-4">
              <GameSearchDialog
                onGameConfirmed={onAddGameList}
                triggerElement={
                  <Button size="lg">
                    <Plus className="w-4 h-4 mr-1" />
                    Add game
                  </Button>
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Arrange button - only shown if user is authenticated */}
      {isAuthenticated && (
        <div className="mt-6 px-4">
          <button
            className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-full transition-colors duration-200"
            onClick={() => router.push(`/venue/${params.id}`)}
          >
            Arrange
          </button>
        </div>
      )}

      {/* QR Code Modal */}
      <QrCodeModal
        isOpen={isQrCodeModalOpen}
        onClose={() => setIsQrCodeModalOpen(false)}
        eventId={params.id as string}
        eventTitle={event?.title}
        gameCovers={gameCovers}
      />

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
