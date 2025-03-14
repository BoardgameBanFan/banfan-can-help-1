"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CircularProgress } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import useSearchGames from "@/hooks/games/useSearchGames";
import debounce from "lodash/debounce";

interface GameData {
  id: string;
  name: string;
  thumbnail?: string;
  image?: string;
  minPlayers?: number;
  maxPlayers?: number;
  description?: string;
  year?: number;
  rating?: number;
  usersRated?: number;
}

interface GameSearchProps {
  onGameSelect: (gameData: GameData) => void;
  returnPath?: string;
  showBackButton?: boolean;
  backPath?: string;
}

export function GameSearch({
  onGameSelect,
  returnPath = "/create-event",
  showBackButton = true,
  backPath = "/create-event"
}: GameSearchProps) {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const { searchGames, searchResults = [], isLoading } = useSearchGames();

  const debouncedSearch = useCallback(
    debounce((value) => {
      searchGames(value);
    }, 500),
    [searchGames]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSearch(value);
  };

  const handleGameSelect = (selectedGame: GameData) => {
    onGameSelect(selectedGame);
  };

  return (
    <div className="bg-[#f1efe9] min-h-screen p-6 font-sans">
      <div className="flex items-center gap-4 mb-6">
        {showBackButton && (
          <Link href={backPath} className="p-2 hover:bg-black/5 rounded-full transition-colors">
            <ArrowBackIcon />
          </Link>
        )}
        <h1 className="text-2xl font-bold">Search Game</h1>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Type at least 2 characters to search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
            />
          </div>
        </div>

        <div className="relative">
          {isLoading && (
            <div className="absolute right-4 top-4">
              <CircularProgress size={20} />
            </div>
          )}
          
          <div className="space-y-2">
            {searchResults.map((game) => (
              <button
                key={game.id}
                onClick={() => handleGameSelect(game)}
                className="w-full bg-white p-4 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  {game.thumbnail && (
                    <img
                      src={game.thumbnail}
                      alt={game.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1 text-left">
                    <h3 className="font-medium text-lg">{game.name}</h3>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <span>{game.year ? `(${game.year})` : ""}</span>
                      {game.minPlayers && game.maxPlayers && (
                        <span>• {game.minPlayers}-{game.maxPlayers} players</span>
                      )}
                      {game.rating && (
                        <span>• Rating: {game.rating.toFixed(1)}</span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}

            {inputValue.length >= 2 && !isLoading && searchResults.length === 0 && (
              <div className="bg-white p-4 rounded-lg text-center text-gray-500">
                No games found
              </div>
            )}

            {inputValue.length < 2 && (
              <div className="bg-white p-4 rounded-lg text-center text-gray-500">
                Type at least 2 characters to search
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}