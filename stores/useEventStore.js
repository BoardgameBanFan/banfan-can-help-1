import { create } from "zustand";
import { persist } from "zustand/middleware";

const useEventStore = create(
  persist(
    set => ({
      eventData: {
        title: "",
        date: "",
        startTime: "",
        location1: "",
        location2: "",
        maxAccommodate: 20,
        allowAttendeesAddGames: true,
        voteUntilDate: "",
        games: [],
      },

      updateEventData: data =>
        set(state => ({
          eventData: { ...state.eventData, ...data },
        })),

      addGame: newGame =>
        set(state => {
          const gameExists = state.eventData.games.some(
            game => game.game.bgg_id === newGame.game.bgg_id
          );

          if (gameExists) return state;

          return {
            eventData: {
              ...state.eventData,
              games: [newGame, ...state.eventData.games],
            },
          };
        }),

      removeGame: bggId =>
        set(state => ({
          eventData: {
            ...state.eventData,
            games: state.eventData.games.filter(game => game.game.bgg_id !== bggId),
          },
        })),

      toggleAllowAttendeesAddGames: () =>
        set(state => ({
          eventData: {
            ...state.eventData,
            allowAttendeesAddGames: !state.eventData.allowAttendeesAddGames,
          },
        })),

      resetEventData: () =>
        set({
          eventData: {
            title: "",
            date: "",
            startTime: "",
            location1: "",
            location2: "",
            maxAccommodate: 20,
            allowAttendeesAddGames: true,
            voteUntilDate: "",
            games: [],
          },
        }),
    }),
    {
      name: "event-storage",
    }
  )
);

export default useEventStore;
