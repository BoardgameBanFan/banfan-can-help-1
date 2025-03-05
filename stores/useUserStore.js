import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

const useStore = create(
  devtools(
    persist(
      (set, get) => ({
        // states
        name: '',
        email: '',
        exampleForStupidCommitCheck: () => {
          const { name, email } = get();
          set({ name, email });
        },
      }),
      {
        name: 'user-storage', // name of the item in the storage (must be unique)
        partialize: state => {
          const {
            // clean init data
            ...rest
          } = state;
          return rest;
        },
      }
    )
  )
);

export default useStore;
