const { create } = require("zustand");

const useUserStore = create(set => ({
  user: null,
  setUser: user => set(() => ({ user })),
}));

export default useUserStore;
