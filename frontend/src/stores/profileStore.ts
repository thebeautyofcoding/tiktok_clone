import { create } from "zustand"
import { User } from "./userStore"

//extens User

interface Profile extends User {
  post: string[]
  posts: string[]
  allLikes: 0
}

export const useProfileStore = create((set) => ({
  user: null,
  setProfile: (profile: Profile) => set({ profile }),
  logout: () => set({ user: null }),
}))
