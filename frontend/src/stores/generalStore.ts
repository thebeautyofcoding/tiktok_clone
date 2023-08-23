import { create } from "zustand"
import { persist, devtools } from "zustand/middleware"

export interface GeneralState {
  isLoginOpen: boolean
  isEditProfileOpen: boolean
  selectedPosts: null
  ids: null
  isBackUrl: "/"
  posts: null
  suggested: null
}
export interface GeneralActions {
  setLoginIsOpen: (isLoginOpen: boolean) => void
  setIsEditProfileOpen: () => void
}

// export const useGeneralStore = create<General>((set) => ({
//   general: null,
//   isLoginOpen: false,
//   isEditProfileOpen: false,
//   selectedPosts: null,
//   ids: null,
//   isBackUrl: "/",
//   posts: null,
//   suggested: null,
//   setLoginIsOpen: (isLoginOpen: boolean) => {
//     set({ isLoginOpen })
//     console.log("isLoginOpen", isLoginOpen)
//   },
// }))

const useGeneralStore = create<GeneralState & GeneralActions>()(
  devtools(
    persist(
      (set) => ({
        isLoginOpen: false,
        isEditProfileOpen: false,
        selectedPosts: null,
        ids: null,
        isBackUrl: "/",
        posts: null,
        suggested: null,
        setLoginIsOpen: (isLoginOpen: boolean) => {
          set({ isLoginOpen })
        },
        setIsEditProfileOpen: () => {
          return set((state) => ({
            isEditProfileOpen: !state.isEditProfileOpen,
          }))
        },
      }),
      {
        name: "general-storage",
      }
    )
  )
)

export default useGeneralStore
