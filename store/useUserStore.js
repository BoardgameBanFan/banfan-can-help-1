const { create } = require("zustand");

const useUserStore = create(set => ({
  user: {
    _id: "",
    avatar: "",
    email: "",
    username: "",
  },
  setUser: user => set(() => ({ user })),
}));

export default useUserStore;
