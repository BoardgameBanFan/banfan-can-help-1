"use client";
import { useMemo } from 'react';

interface GameCover {
  thumbnail: string;
  name?: string;
}

/**
 * Custom hook that creates a background component with a 4x4 grid of game covers
 * @param gameCovers Array of game cover objects with thumbnail URLs
 * @returns A component that renders the game covers grid background
 */
export function useGameCoversBackground(gameCovers: GameCover[]) {
  // Generate randomized indices as a separate useMemo
  const randomizedIndices = useMemo(() => {
    if (!gameCovers || gameCovers.length === 0) {
      return [];
    }
    // Generate an array of 16 random indices
    return Array.from({ length: 16 }, () =>
      Math.floor(Math.random() * gameCovers.length)
    );
  }, [gameCovers]);

  // Generate the component in a separate useMemo
  return useMemo(() => {
    if (!gameCovers || gameCovers.length === 0) {
      return null;
    }

    // Create an array of 16 positions (0-15) for the 4x4 grid
    const positions = Array.from({ length: 16 }, (_, i) => i);

    // Return the background component
    return (
      <div className="absolute inset-0 overflow-hidden z-1 opacity-15">
        {/* Main container for the rotated grid - start from top instead of center */}
        <div className="absolute inset-0 flex items-start justify-center">
          {/* Container for the grid with rotation - 50% larger than before */}
          <div
            className="relative"
            style={{
              width: '500vmin',
              height: '150vmin',
              transform: 'rotate(40deg)',
              marginRight: '-20vmin',
              marginTop: '-20vmin',
            }}
          >
            {/* Display the covers using flexbox with center alignment */}
            <div style={{
                width:'180vw'
                }}
                 className="h-full flex flex-wrap justify-center">
              {positions.map((position) => {
                // Get a random cover using the pre-generated random indices
                const cover = randomizedIndices.length > position ?
                  gameCovers[randomizedIndices[position]] :
                  undefined;

                return (
                  <div
                    key={position}
                    className="bg-gray-300 rounded-lg overflow-hidden"
                    style={{
                      width: '36vw', // 更改为每行4个
                      height: '36vw', // 保持相同大小确保正方形
                      margin: '10px',
                    }}
                  >
                    {cover && cover.thumbnail ? (
                      <img
                        src={cover.thumbnail}
                        alt={cover.name || `Game cover ${position + 1}`}
                        className="w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }, [gameCovers, randomizedIndices]);
}
