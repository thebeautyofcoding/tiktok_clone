import { create } from "zustand"
import { persist } from "zustand/middleware"

type PostState = {
  likedPosts: Array<{
    id: number
    userId: number
    postId: number
  }>
  likePost: (post: { id: number; userId: number; postId: number }) => void
  removeLike: (postId: number) => void
}

export const usePostStore = create<PostState>()(
  persist(
    (set) => ({
      likedPosts: [],
      likePost: (post) => {
        set((state) => {
          console.log("likedPosts", state.likedPosts)
          return { likedPosts: [...state.likedPosts, post] }
        })
      },
      removeLike: (postId) =>
        set((state) => ({
          likedPosts: state.likedPosts.filter((p) => p.postId !== postId),
        })),
    }),
    {
      name: "post-storage", // unique name for local storage key
    }
  )
)
