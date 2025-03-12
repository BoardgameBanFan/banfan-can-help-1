import { create } from "zustand";
import { persist } from "zustand/middleware";

const useEventStore = create(
  persist(
    set => ({
      eventData: {
        title: "",
        host_at: "",
        address: "",
        min_players: 1,
        max_players: 20,
        fee: 0,
        vote_end_at: "",
        games: [],
        // UI 相關的狀態
        allowAttendeesAddGames: true,
        // 暫存表單資料
        formData: {
          date: "",
          startTime: "",
          location1: "",
          location2: "",
        },
      },

      updateEventData: data =>
        set(state => ({
          eventData: {
            ...state.eventData,
            ...data,
            // 如果更新的是表單資料，同時更新 formData
            formData: {
              ...state.eventData.formData,
              ...(data.date !== undefined && { date: data.date }),
              ...(data.startTime !== undefined && { startTime: data.startTime }),
              ...(data.location1 !== undefined && { location1: data.location1 }),
              ...(data.location2 !== undefined && { location2: data.location2 }),
            },
          },
        })),

      // 準備提交表單時調用，將表單資料轉換為 API 格式
      prepareEventData: () =>
        set(state => {
          const { formData } = state.eventData;

          // 組合日期和時間為 ISO 格式
          let host_at = "";
          if (formData.date && formData.startTime) {
            try {
              host_at = new Date(`${formData.date}T${formData.startTime}`).toISOString();
            } catch (err) {
              console.error("Date conversion error:", err);
            }
          }

          // 組合地址，過濾掉空值
          const address = [formData.location1, formData.location2].filter(Boolean).join(", ");

          // 確保 vote_end_at 是 ISO 格式
          let vote_end_at = state.eventData.vote_end_at;
          if (vote_end_at) {
            try {
              vote_end_at = new Date(`${vote_end_at}T23:59:59`).toISOString();
            } catch (err) {
              console.error("Vote end date conversion error:", err);
            }
          }

          return {
            eventData: {
              ...state.eventData,
              host_at,
              address,
              vote_end_at,
            },
          };
        }),

      addGame: gameData =>
        set(state => {
          const gameExists = state.eventData.games.some(game => game.game_id === gameData.game_id);

          if (gameExists) return state;

          return {
            eventData: {
              ...state.eventData,
              games: [gameData, ...state.eventData.games],
            },
          };
        }),

      removeGame: gameId =>
        set(state => ({
          eventData: {
            ...state.eventData,
            games: state.eventData.games.filter(game => game.game_id !== gameId),
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
            host_at: "",
            address: "",
            min_players: 1,
            max_players: 20,
            fee: 0,
            vote_end_at: "",
            games: [],
            allowAttendeesAddGames: true,
            formData: {
              date: "",
              startTime: "",
              location1: "",
              location2: "",
            },
          },
        }),
    }),
    {
      name: "event-storage",
    }
  )
);

export default useEventStore;
