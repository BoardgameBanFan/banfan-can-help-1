import AuthProvider from "@/components/Auth/AuthProvider";
import Navbar from "@/components/Navbar/Navbar";
import SelectGameDrawer from "@/components/Pocket/SelectGameDrawer";
import { create } from "zustand";

export const useSelectGameDrawerStore = create(set => ({
  onSelectGame: null,
  setSelectGameFunc: func => set(() => ({ onSelectGame: func })),
}));

export default function PocketLayout({ children }) {
  return (
    <AuthProvider>
      <Navbar />
      <div className="p-4 pt-16">{children}</div>
      <SelectGameDrawer />
    </AuthProvider>
  );
}
