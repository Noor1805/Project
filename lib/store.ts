import { create } from "zustand";

// Note: With NextAuth, useSession hook is preferred for auth state.
// This store remains for potential non-auth application state or legacy bridge.

interface AppStore {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
