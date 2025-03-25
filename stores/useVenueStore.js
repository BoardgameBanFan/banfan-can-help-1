/* eslint-disable no-unused-vars */
import { add } from "lodash";
import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { create as mutate } from "mutative";

const useStore = create(
  devtools(
    persist(
      (set, get) => ({
        // states
        userRankReadyNameSet: new Set(),
        addRankReadyUserName: user_name => {
          set(state => ({
            userRankReadyNameSet: new Set([...state.userRankReadyNameSet, user_name]),
          }));
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
            userRankReadyNameSet, // Set can't save in localStorage
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
