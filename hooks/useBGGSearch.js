'use client';
import { useState } from 'react';
import { XMLParser } from 'fast-xml-parser';

export const useBGGSearch = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchGames = async query => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://boardgamegeek.com/xmlapi2/search?query=${encodeURIComponent(query)}&type=boardgame`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch games');
      }

      const xmlText = await response.text();
      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '',
      });

      const result = parser.parse(xmlText);

      // Handle no results case
      if (!result.items || !result.items.item) {
        setSearchResults([]);
        setIsLoading(false);
        return;
      }

      // Normalize the response to always be an array
      const items = Array.isArray(result.items.item) ? result.items.item : [result.items.item];

      // Get details for each game (limit to first 10 results to avoid large requests)
      const gameIds = items
        .slice(0, 10)
        .map(item => item.id)
        .join(',');
      const detailsResponse = await fetch(
        `https://boardgamegeek.com/xmlapi2/thing?id=${gameIds}&stats=1`
      );

      if (!detailsResponse.ok) {
        throw new Error('Failed to fetch game details');
      }

      const detailsXml = await detailsResponse.text();
      const detailsResult = parser.parse(detailsXml);

      // Normalize the details response to always be an array
      const games = Array.isArray(detailsResult.items.item)
        ? detailsResult.items.item
        : [detailsResult.items.item];

      const formattedResults = games.map(game => {
        // Handle the case where name might be a single object or an array
        const names = Array.isArray(game.name) ? game.name : [game.name];
        const primaryName = names.find(n => n.type === 'primary')?.value || names[0].value;

        return {
          id: game.id,
          name: primaryName,
          year: game.yearpublished?.value,
          thumbnail: game.thumbnail,
          image: game.image,
          description: game.description,
          minPlayers: game.minplayers?.value,
          maxPlayers: game.maxplayers?.value,
          names: names.map(n => ({
            language: n.type === 'primary' ? 'primary' : 'alternate',
            value: n.value,
          })),
        };
      });

      setSearchResults(formattedResults);
    } catch (err) {
      console.error('BGG Search Error:', err);
      setError(err.message);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    searchResults,
    isLoading,
    error,
    searchGames,
  };
};
