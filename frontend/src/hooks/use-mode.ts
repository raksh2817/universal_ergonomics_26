import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AppMode = "retail" | "wholesale";

interface ModeState {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  toggle: () => void;
  isWholesale: () => boolean;
}

export const useMode = create<ModeState>()(
  persist(
    (set, get) => ({
      mode: "retail",
      setMode: (mode) => set({ mode }),
      toggle: () => set((s) => ({ mode: s.mode === "retail" ? "wholesale" : "retail" })),
      isWholesale: () => get().mode === "wholesale",
    }),
    { name: "ue-mode" }
  )
);
