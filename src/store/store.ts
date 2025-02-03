import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  name: string
  email: string
  token: string
}

interface StoreState {
  user: User | null
  setUser: (user: User | null) => void
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: "marketplace-storage",
    },
  ),
)

