"use client";
import { useState } from "react";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useUserStore from "@/stores/useUserStore";
import UserQuickInfoModal from "@/components/UserQuickInfoModal";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

interface Game {
  id: string;
  name: string;
  bggId?: string;
  thumbnail?: string;
  image?: string;
  minPlayers?: number;
  maxPlayers?: number;
  description?: string;
  year?: number;
  rating?: number;
  usersRated?: number;
}

interface GameFormProps {
  game: Game;
  onSubmit: (gameData: {
    game_id: string;
    add_by: string;
    comment: string;
    game?: Game;
  }) => Promise<void>;
  backPath: string;
  cancelPath: string;
  userName?: string;
  includeGameData?: boolean;
}

export function GameForm({
  game,
  onSubmit,
  backPath,
  cancelPath,
  includeGameData = false,
}: GameFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = useTranslations();

  const [gameData, setGameData] = useState({
    coverPhoto: null,
    coverPhotoPreview: game.image || null,
    description: game.description || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGameData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!game) return;

    const { checkUserData, name } = useUserStore.getState();

    if (!checkUserData(["name"], true)) {
      toast(t("Please fill in your name first"));
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        game_id: game.id,
        add_by: name,
        comment: gameData.description || "推薦遊戲",
        ...(includeGameData && {
          game: {
            name: game.name,
            bgg_id: game.bggId,
            thumbnail: game.thumbnail,
            image: game.image,
            min_player: game.minPlayers,
            max_player: game.maxPlayers,
            description: gameData.description || game.description,
            year_published: game.year,
            rating: game.rating,
            users_rated: game.usersRated,
          },
        }),
      };

      await onSubmit(submitData as never);
    } catch (error) {
      console.error("Error adding game:", error);
      alert("Failed to add game");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <UserQuickInfoModal mode="email" />
      <div className="bg-[#f1efe9] min-h-screen font-sans">
        <div className="flex items-center gap-4 mb-6">
          <Link href={backPath} className="p-2 hover:bg-black/5 rounded-full transition-colors">
            <ArrowBackIcon />
          </Link>
          <h1 className="text-2xl font-bold">Add Game</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block font-medium">Selected game</label>
              <div className="flex items-center p-2 border rounded-md">
                {game.thumbnail && (
                  <img
                    src={game.thumbnail}
                    alt={game.name}
                    className="w-12 h-12 object-cover rounded mr-3"
                  />
                )}
                <div>
                  <div className="font-medium">{game.name}</div>
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    <span>{game.year ? `(${game.year})` : ""}</span>
                    {game.minPlayers && game.maxPlayers && (
                      <span>
                        • {game.minPlayers}-{game.maxPlayers} players
                      </span>
                    )}
                    {game.rating && <span>• Rating: {game.rating.toFixed(1)}</span>}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-medium">Cover Photo</label>
              <div className="w-full">
                <div className="w-full relative">
                  <img
                    src={gameData.coverPhotoPreview}
                    alt="Cover preview"
                    className="w-full rounded-md"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-medium">Description</label>
              <textarea
                name="description"
                value={gameData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:border-gray-500"
                placeholder="Write a description..."
              />
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-[#1e6494] text-white py-3 rounded-full hover:bg-[#185380] transition-colors text-center ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Adding..." : "Add this game"}
              </button>
              <Link
                href={cancelPath}
                className="w-full bg-black text-white py-3 rounded-full hover:bg-gray-800 transition-colors text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
