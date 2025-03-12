"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useUser } from "@/hooks/useUser";
import useEventStore from "@/stores/useEventStore";

export default function AddGamePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const { addGame } = useEventStore();
  const fileInputRef = useRef(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [gameData, setGameData] = useState({
    coverPhoto: null,
    coverPhotoPreview: null,
    description: "",
  });

  useEffect(() => {
    // 從 URL 讀取遊戲資料
    const gameParam = searchParams.get("game");
    if (gameParam) {
      try {
        const game = JSON.parse(decodeURIComponent(gameParam));
        setSelectedGame(game);
        setGameData(prev => ({
          ...prev,
          description: game.description || "",
          coverPhotoPreview: game.image || null,
        }));
      } catch (error) {
        console.error("Error parsing game data:", error);
        router.push("/create-event/search-game");
      }
    } else {
      // 如果沒有遊戲資料，導回搜尋頁面
      router.push("/create-event/search-game");
    }
  }, [searchParams, router]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setGameData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (file) {
      setGameData(prev => ({
        ...prev,
        coverPhoto: file,
        coverPhotoPreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!selectedGame) {
      return;
    }

    const gameToSubmit = {
      game: {
        name: selectedGame.name,
        bgg_id: selectedGame.bggId,
        thumbnail: selectedGame.thumbnail,
        image: selectedGame.image,
        min_player: selectedGame.minPlayers,
        max_player: selectedGame.maxPlayers,
        description: gameData.description || selectedGame.description,
        year_published: selectedGame.year,
        rating: selectedGame.rating,
        users_rated: selectedGame.usersRated,
      },
      add_by: user?.name || "Anonymous",
    };

    try {
      // 直接使用 Zustand store 添加遊戲
      addGame(gameToSubmit);
      // 導航回創建活動頁面
      router.push("/create-event");
    } catch (error) {
      console.error("Error adding game:", error);
    }
  };

  if (!selectedGame) {
    return null; // 等待導向到搜尋頁面
  }

  return (
    <div className="bg-[#f1efe9] min-h-screen p-6 font-sans">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/create-event/search-game"
          className="p-2 hover:bg-black/5 rounded-full transition-colors"
        >
          <ArrowBackIcon />
        </Link>
        <h1 className="text-2xl font-bold">Add Game</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block font-medium">Selected game</label>
            <div className="flex items-center p-2 border rounded-md">
              {selectedGame?.thumbnail && (
                <img
                  src={selectedGame.thumbnail}
                  alt={selectedGame.name}
                  className="w-12 h-12 object-cover rounded mr-3"
                />
              )}
              <div>
                <div className="font-medium">{selectedGame.name}</div>
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <span>{selectedGame.year ? `(${selectedGame.year})` : ""}</span>
                  {selectedGame.minPlayers && selectedGame.maxPlayers && (
                    <span>
                      • {selectedGame.minPlayers}-{selectedGame.maxPlayers} players
                    </span>
                  )}
                  {selectedGame.rating && <span>• Rating: {selectedGame.rating.toFixed(1)}</span>}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block font-medium">Cover Photo</label>
            <div className="w-full">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              {gameData.coverPhotoPreview ? (
                <div className="w-full relative">
                  <img
                    src={gameData.coverPhotoPreview}
                    alt="Cover preview"
                    className="w-full rounded-md"
                  />
                  <button
                    type="button"
                    onClick={handleUploadClick}
                    className="absolute inset-0 w-full h-full bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white rounded-md"
                  >
                    <FileUploadIcon className="mr-2" sx={{ fontSize: 24 }} />
                    Change Photo
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleUploadClick}
                  className="w-full aspect-square rounded-md bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <FileUploadIcon className="text-gray-400 mb-2" sx={{ fontSize: 48 }} />
                  <span className="text-gray-500">Upload file</span>
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block font-medium">Description</label>
            <textarea
              name="description"
              value={gameData.description}
              onChange={handleInputChange}
              rows="4"
              className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:border-gray-500"
              placeholder="Write a description..."
            />
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <button
              type="submit"
              className="w-full bg-[#1e6494] text-white py-3 rounded-full hover:bg-[#185380] transition-colors text-center"
            >
              Add this game
            </button>
            <Link
              href="/create-event"
              className="w-full bg-black text-white py-3 rounded-full hover:bg-gray-800 transition-colors text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
