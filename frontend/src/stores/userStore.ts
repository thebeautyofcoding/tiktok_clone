import { create } from "zustand"

import { persist, devtools } from "zustand/middleware"

export interface User {
  id?: string
  fullname: string
  email?: string
  bio?: string
  image?: string
}

export interface UserActions {
  setUser: (user: User) => void
  logout: () => void
}

export const useUserStore = create<User & UserActions>()(
  devtools(
    persist(
      (set) => ({
        id: "",
        fullname: "",
        email: "",
        bio: "",
        image: "",

        setUser: (user) => set(user),
        logout: () => {
          set({ id: "", fullname: "", email: "", bio: "", image: "" })
        },
      }),
      {
        name: "user-storage",
      }
    )
  )
)
