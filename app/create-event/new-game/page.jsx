"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useBGGSearch } from "@/hooks/useBGGSearch";
import { useUser } from "@/hooks/useUser";
import useEventStore from "@/stores/useEventStore";
import debounce from "lodash/debounce";

export default function AddGamePage() {
  const router = useRouter();
  const { user } = useUser();
  const { addGame } = useEventStore();
  const fileInputRef = useRef(null);
  const { searchGames, searchResults, isLoading, error } = useBGGSearch();
  const [selectedGame, setSelectedGame] = useState(null);
  const [gameData, setGameData] = useState({
    coverPhoto: null,
    coverPhotoPreview: null,
    description: "",
  });

  const debouncedSearch = debounce(query => {
    searchGames(query);
  }, 500);

  const handleGameChange = (event, newValue) => {
    setSelectedGame(newValue);
    if (newValue) {
      setGameData(prev => ({
        ...prev,
        description: newValue.description || "",
        coverPhotoPreview: newValue.image || null,
      }));
    }
  };

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
        bgg_id: selectedGame.id,
        thumbnail: selectedGame.thumbnail,
        image: selectedGame.image,
        min_player: selectedGame.minPlayers,
        max_player: selectedGame.maxPlayers,
        description: gameData.description || selectedGame.description,
        year_published: selectedGame.year,
        names: selectedGame.names,
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

  return (
    <div className="bg-[#f1efe9] min-h-screen p-6 font-sans">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/create-event" className="p-2 hover:bg-black/5 rounded-full transition-colors">
          <ArrowBackIcon />
        </Link>
        <h1 className="text-2xl font-bold">Add Game</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block font-medium">Select game</label>
            <Autocomplete
              options={searchResults}
              getOptionLabel={option => option.name}
              onChange={handleGameChange}
              onInputChange={(event, value) => debouncedSearch(value)}
              loading={isLoading}
              renderInput={params => (
                <TextField
                  {...params}
                  placeholder="Search for a game..."
                  error={!!error}
                  helperText={error}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                    sx: {
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgb(209 213 219)",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgb(156 163 175)",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgb(107 114 128)",
                        borderWidth: "1px",
                      },
                      padding: "4px 8px",
                    },
                  }}
                  sx={{
                    "& .MuiAutocomplete-input": {
                      padding: "4px 0 !important",
                    },
                  }}
                />
              )}
              renderOption={(props, option) => (
                <li {...props} className="flex items-center p-2">
                  {option.thumbnail && (
                    <img
                      src={option.thumbnail}
                      alt={option.name}
                      className="w-12 h-12 object-cover rounded mr-3"
                    />
                  )}
                  <div>
                    <div className="font-medium">{option.name}</div>
                    <div className="text-sm text-gray-500">
                      {option.year ? `(${option.year})` : ""}
                      {option.minPlayers && option.maxPlayers
                        ? ` • ${option.minPlayers}-${option.maxPlayers} players`
                        : ""}
                    </div>
                  </div>
                </li>
              )}
              noOptionsText="No games found"
              loadingText="Searching..."
              sx={{
                "& .MuiAutocomplete-listbox": {
                  padding: 0,
                },
              }}
            />
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
