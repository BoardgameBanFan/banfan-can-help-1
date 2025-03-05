'use client';
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function AddGamePage() {
  const fileInputRef = useRef(null);
  const [gameData, setGameData] = useState({
    game: '',
    coverPhoto: null,
    coverPhotoPreview: null,
    description: '',
  });

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

  const handleSubmit = e => {
    e.preventDefault();
    console.log(gameData);
    // TODO: Handle form submission
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
            <input
              type="text"
              name="game"
              value={gameData.game}
              onChange={handleInputChange}
              className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:border-gray-500"
              placeholder="Search for a game..."
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
