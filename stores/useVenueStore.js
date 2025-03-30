/* eslint-disable @typescript-eslint/no-unused-vars */

import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { create as mutate } from "mutative";

const useStore = create(
  devtools(
    persist(
      (set, get) => ({
        // states
        userRankReadyNameMap: {
          // name: rank_number
        },
        addRankReadyUserName: (user_name, rank, isSubmit) => {
          set(
            mutate(({ userRankReadyNameMap }) => {
              const targetUserRankNumber = userRankReadyNameMap?.[user_name];
              if (!targetUserRankNumber || (targetUserRankNumber && targetUserRankNumber < rank)) {
                userRankReadyNameMap[user_name] = isSubmit ? 3 : rank;
              }
            })
          );
        },

        myRankList: [...Array(3)],
        setMyRankList: (id, rank) => {
          set(
            mutate(({ myRankList }) => {
              myRankList.forEach((event_game_id, index) => {
                if (index === rank - 1) {
                  myRankList[rank - 1] = id;
                } else if (event_game_id === id) {
                  myRankList[index] = undefined;
                }
              });
            })
          );
        },

        arrangeGameEvent: "",
        initArrangeData: eventID => {
          const { arrangeGameEvent } = get();
          if (arrangeGameEvent !== eventID) {
            set({
              arrangeGameEvent: eventID,
              giveUpRankIdList: [],
              formedGameIdMap: {},
            });
          }
        },
        giveUpRankIdList: [],
        formedGameIdMap: {},
      }),
      {
        name: "venue-storage", // name of the item in the storage (must be unique)
        partialize: state => {
          const {
            // clean init data
            userRankReadyNameMap, // Set can't save in localStorage
            myRankList,
            ...rest
          } = state;
          return rest;
        },
      }
    )
  )
);

export default useStore;
