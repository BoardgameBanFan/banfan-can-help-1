import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

const useStore = create(
  devtools(
    persist(
      (set, get) => ({
        // states
        isLogin: false,
        name: "",
        email: "",

        venueName: "", // only used in venue public display name
        isOpenUserQuickInfoModal: false,

        checkUserData: (checkList = ["name", "email"], isOpenUserQuickInfoModalDirectly = true) => {
          const allData = get();
          const isAllFilled = checkList.every(key => allData[key]);
          if (!isAllFilled && isOpenUserQuickInfoModalDirectly) {
            set({ isOpenUserQuickInfoModal: true });
          }
          return isAllFilled;
        },
      }),
      {
        name: "user-storage", // name of the item in the storage (must be unique)
        partialize: state => {
          const {
            // clean init data
            // eslint-disable-next-line no-unused-vars
            isOpenUserQuickInfoModal,
            ...rest
          } = state;
          return rest;
        },
      }
    )
  )
);

export default useStore;
