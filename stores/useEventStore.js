import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

const useEventStore = create(
  devtools(
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
                ...(data.startTime !== undefined && {
                  startTime: data.startTime,
                }),
                ...(data.location1 !== undefined && {
                  location1: data.location1,
                }),
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

            // 直接使用 location1 作為地址
            const address = formData.location1;

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
            // 檢查遊戲是否已存在
            const gameExists = state.eventData.games.some(
              game => game.game_id === gameData.game_id
            );

            if (gameExists) return state;

            // 轉換資料格式
            const formattedGame = {
              game_id: gameData.game_id,
              add_by: gameData.add_by,
              comment: gameData.comment || "推薦遊戲", // 確保有預設值
              game: gameData.game,
            };

            return {
              eventData: {
                ...state.eventData,
                games: [formattedGame, ...state.eventData.games],
              },
            };
          }),

        updateGame: (gameId, updates) =>
          set(state => ({
            eventData: {
              ...state.eventData,
              games: state.eventData.games.map(game =>
                game.game_id === gameId
                  ? {
                      ...game,
                      comment: updates.description || game.comment,
                      game: {
                        ...game.game,
                        description: updates.description || game.game.description,
                        image: updates.image || game.game.image,
                      },
                    }
                  : game
              ),
            },
          })),

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
              },
            },
          }),
      }),
      {
        name: "event-storage",
      }
    )
  )
);

export default useEventStore;
