"use client";
import { useState, useRef } from "react";
import FileUploadIcon from "@mui/icons-material/FileUpload";

interface Game {
  name: string;
  thumbnail?: string;
  image?: string;
  description?: string;
  min_player?: number;
  max_player?: number;
}

interface EditGameFormProps {
  game: Game;
  onSubmit: (data: { description: string; image?: File }) => void;
  onCancel: () => void;
}

export function EditGameForm({ game, onSubmit, onCancel }: EditGameFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    description: game.description || "",
    image: null as File | null,
    imagePreview: game.image || game.thumbnail,
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 驗證檔案大小（例如：最大 5MB）
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setError(null);

      if (!formData.description.trim()) {
        throw new Error("Description is required");
      }

      await onSubmit({
        description: formData.description.trim(),
        ...(formData.image && { image: formData.image }),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="font-medium text-lg mb-2">{game.name}</h3>
        <div className="text-sm text-gray-500">
          {game.min_player && game.max_player && (
            <span>{game.min_player}-{game.max_player} players</span>
          )}
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
          {formData.imagePreview ? (
            <div className="w-full relative aspect-video">
              <img
                src={formData.imagePreview}
                alt="Cover preview"
                className="w-full h-full object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 w-full h-full bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white rounded-md"
              >
                <FileUploadIcon className="mr-2" />
                Change Photo
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full aspect-square rounded-md bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <FileUploadIcon className="text-gray-400 mb-2" />
              <span className="text-gray-500">Upload file</span>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block font-medium">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={4}
          className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:border-gray-500"
          placeholder="Write a description..."
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex-1 bg-[#1e6494] text-white py-2 rounded-full hover:bg-[#185380] transition-colors ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 bg-black text-white py-2 rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}