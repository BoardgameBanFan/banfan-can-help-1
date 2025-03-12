"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import GroupIcon from "@mui/icons-material/Group";
import CheckIcon from "@mui/icons-material/Check";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useUser } from "@/hooks/useUser";
import useEventStore from "@/stores/useEventStore";
import { useEventActions } from "@/hooks/event/useEventActions";
import { cleanDescription } from "@/utils/text";

export default function CreateEventPage() {
  const router = useRouter();
  const { user } = useUser();
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    gameToDelete: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const { eventData, updateEventData, removeGame, toggleAllowAttendeesAddGames, resetEventData } =
    useEventStore();

  const { createEvent, addGameToEvent } = useEventActions();

  const canDeleteGame = () => {
    // TODO: Add back permission check later
    // if (!user) return false;
    // return game.add_by === user.name;
    return true;
  };

  const handleDeleteClick = game => {
    setDeleteDialog({
      open: true,
      gameToDelete: game,
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.gameToDelete) {
      removeGame(deleteDialog.gameToDelete.game_id);
    }
    setDeleteDialog({
      open: false,
      gameToDelete: null,
    });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({
      open: false,
      gameToDelete: null,
    });
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    updateEventData({ [name]: value });
  };

  const handleMaxAccommodateChange = increment => {
    updateEventData({
      maxAccommodate: Math.max(1, eventData.maxAccommodate + increment),
    });
  };

  const handleAllowAttendeesAddGamesChange = () => {
    toggleAllowAttendeesAddGames();
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      // 驗證必填欄位
      if (!eventData.title) {
        throw new Error("請輸入活動標題");
      }
      if (!eventData.formData.date || !eventData.formData.startTime) {
        throw new Error("請選擇活動日期和時間");
      }
      if (!eventData.formData.location1) {
        throw new Error("請輸入活動地點");
      }

      // 直接處理數據轉換
      const host_at = new Date(
        `${eventData.formData.date}T${eventData.formData.startTime}`
      ).toISOString();

      const address = [eventData.formData.location1, eventData.formData.location2]
        .filter(Boolean)
        .join(", ");

      let vote_end_at = undefined;
      if (eventData.vote_end_at) {
        vote_end_at = new Date(`${eventData.vote_end_at}T23:59:59`).toISOString();
      }

      const submitData = {
        title: eventData.title,
        address,
        host_at,
        min_players: eventData.min_players,
        max_players: eventData.max_players,
        fee: eventData.fee,
        vote_end_at,
      };

      console.log("Debug - submitData:", submitData);

      // 創建活動並獲取活動 ID
      const eventId = await createEvent(submitData);

      // 如果有遊戲，則添加遊戲
      if (eventId && eventData.games.length > 0) {
        for (const game of eventData.games) {
          await addGameToEvent(eventId, {
            game_id: game.game_id,
            add_by: game.add_by || user?.name || "Anonymous",
            comment: game.comment || "推薦遊戲",
          });
        }
      }

      // 重置 store
      resetEventData();

      // 導航到活動詳情頁
      router.push(`/venue/${eventId}`);
    } catch (err) {
      setError(err.message);
      console.error("建立活動失敗:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="webcrumbs">
      <div className="bg-[#f1efe9] p-6 font-sans">
        {/* Debug info */}
        <div className="mb-4 text-xs text-gray-500">
          Current user: {user ? user.name : "Not logged in"}
        </div>
        <h1 className="text-2xl font-bold mb-6">Create Event</h1>

        <div className="space-y-4">
          <div className="border-b border-black">
            <input
              type="text"
              name="title"
              value={eventData.title}
              onChange={handleInputChange}
              placeholder="Event title"
              className="w-full bg-transparent py-2 focus:outline-none"
            />
          </div>

          <div className="bg-white rounded-md overflow-hidden shadow-sm">
            <div
              className="flex items-center p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => document.querySelector('input[name="date"]').showPicker()}
            >
              <AccessTimeIcon className="mr-3 text-black" />
              <input
                type="date"
                name="date"
                value={eventData.date}
                onChange={handleInputChange}
                placeholder="Date"
                className="w-full bg-transparent focus:outline-none cursor-pointer"
              />
              <KeyboardArrowDownIcon className="text-gray-400" />
            </div>
            <div
              className="p-4 cursor-pointer hover:bg-gray-50 transition-colors flex items-center"
              onClick={() => document.querySelector('input[name="startTime"]').showPicker()}
            >
              <input
                type="time"
                name="startTime"
                value={eventData.startTime}
                onChange={handleInputChange}
                placeholder="Start Time"
                className="w-full bg-transparent focus:outline-none cursor-pointer"
              />
              <KeyboardArrowDownIcon className="text-gray-400" />
            </div>
          </div>

          <div className="bg-white rounded-md overflow-hidden shadow-sm">
            <div className="flex items-center p-4 border-b border-gray-100">
              <LocationOnIcon className="mr-3 text-black" />
              <input
                type="text"
                name="location1"
                value={eventData.location1}
                onChange={handleInputChange}
                placeholder="Location line 1"
                className="w-full bg-transparent focus:outline-none"
              />
            </div>
            <div className="p-4">
              <input
                type="text"
                name="location2"
                value={eventData.location2}
                onChange={handleInputChange}
                placeholder="Location line 2"
                className="w-full bg-transparent focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <GroupIcon className="mr-2 text-black" />
              <span>Max accommodate</span>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => handleMaxAccommodateChange(-1)}
                className="w-6 h-6 rounded-full bg-transparent border border-gray-300 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <RemoveIcon sx={{ fontSize: 16 }} />
              </button>
              <span className="mx-3 text-xl font-bold">{eventData.maxAccommodate}</span>
              <button
                onClick={() => handleMaxAccommodateChange(1)}
                className="w-6 h-6 rounded-full bg-transparent border border-gray-300 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <AddIcon sx={{ fontSize: 16 }} />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Link
                href="/create-event/search-game"
                className="bg-black text-white py-2 px-4 rounded-md flex items-center justify-center hover:bg-gray-800 transition-colors"
              >
                <AddIcon className="mr-1" />
                Add game
              </Link>
              <span className="text-sm text-gray-500">{eventData.games.length} games added</span>
            </div>

            <div>
              <h2 className="font-bold mb-2">Game List</h2>
              <div className="flex items-center mb-2">
                <div
                  onClick={handleAllowAttendeesAddGamesChange}
                  className={`w-5 h-5 border border-gray-400 rounded-sm mr-2 flex items-center justify-center cursor-pointer ${eventData.allowAttendeesAddGames ? "bg-black" : "bg-white"}`}
                >
                  {eventData.allowAttendeesAddGames && <CheckIcon className="text-white text-sm" />}
                </div>
                <span>Allow attenders add games</span>
              </div>

              <div className="mb-2">
                <p>Vote opened until</p>
                <div className="bg-white rounded-md overflow-hidden shadow-sm mt-1">
                  <div
                    className="flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() =>
                      document.querySelector('input[name="voteUntilDate"]').showPicker()
                    }
                  >
                    <AccessTimeIcon className="mr-3 text-black" />
                    <input
                      type="date"
                      name="voteUntilDate"
                      value={eventData.voteUntilDate}
                      onChange={handleInputChange}
                      placeholder="Date"
                      className="w-full bg-transparent focus:outline-none cursor-pointer"
                    />
                    <KeyboardArrowDownIcon className="text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {eventData.games.map((gameItem, index) => (
                  <div
                    key={gameItem.game.bgg_id || index}
                    className="bg-white p-3 rounded-md shadow-sm flex items-start group"
                  >
                    <img
                      src={gameItem.game.thumbnail}
                      alt={gameItem.game.name}
                      className="w-12 h-12 mr-3 rounded object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-bold">{gameItem.game.name}</span>
                        <div className="flex items-center gap-3">
                          {canDeleteGame(gameItem) && (
                            <button
                              onClick={() => handleDeleteClick(gameItem)}
                              className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-600"
                            >
                              <DeleteOutlineIcon />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {cleanDescription(gameItem.game.description)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Nominated by {gameItem.add_by}
                        {gameItem.game.min_player && gameItem.game.max_player && (
                          <span className="ml-2">
                            • {gameItem.game.min_player}-{gameItem.game.max_player} players
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full bg-[#1e6494] text-white py-3 rounded-full mt-6 hover:bg-[#185380] transition-colors ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Creating..." : "Create event"}
          </button>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialog.open}
          onClose={handleDeleteCancel}
          PaperProps={{
            sx: {
              borderRadius: "12px",
              padding: "16px",
              maxWidth: "400px",
              width: "90%",
            },
          }}
        >
          <DialogTitle sx={{ pb: 2, fontSize: "1.5rem", fontWeight: "bold" }}>
            Remove Game
          </DialogTitle>
          <DialogContent sx={{ pb: 3 }}>
            {deleteDialog.gameToDelete && (
              <>
                <div className="flex items-start gap-3 mb-4">
                  {deleteDialog.gameToDelete?.game.thumbnail && (
                    <img
                      src={deleteDialog.gameToDelete.game.thumbnail}
                      alt={deleteDialog.gameToDelete.game.name}
                      className="w-16 h-16 rounded object-cover"
                    />
                  )}
                  <div>
                    <p className="font-bold mb-1">{deleteDialog.gameToDelete?.game.name}</p>
                    <p className="text-sm text-gray-500">
                      Nominated by {deleteDialog.gameToDelete?.add_by}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600">
                  Are you sure you want to remove this game from the list?
                </p>
              </>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }} className="space-x-3">
            <button
              onClick={handleDeleteCancel}
              className="flex-1 bg-black text-white py-3 rounded-full hover:bg-gray-800 transition-colors text-center"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="flex-1 bg-red-500 text-white py-3 rounded-full hover:bg-red-600 transition-colors text-center"
            >
              Remove
            </button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}
