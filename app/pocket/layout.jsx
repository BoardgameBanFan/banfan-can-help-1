import SelectGameDrawer from "@/components/Pocket/SelectGameDrawer";
import { create } from "zustand";

export const useSelectGameDrawerStore = create(set => ({
  onSelectGame: null,
  setSelectGameFunc: func => set(() => ({ onSelectGame: func })),
}));

export default function PocketLayout({ children }) {
  return (
    <div>
      <div className="p-4">{children}</div>
      <SelectGameDrawer />
    </div>
  );
}
