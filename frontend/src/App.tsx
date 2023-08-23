import AuthOverlay from "./components/AuthOverlay"
import "./index.css"
import useGeneralStore from "./stores/generalStore"
import { useUserStore } from "./stores/userStore"
import EditProfileOverlay from "./components/EditProfileOverlay"
function App() {
  const isLoginOpen = useGeneralStore((state) => state.isLoginOpen)
  const isEditProfileOpen = useGeneralStore((state) => state.isEditProfileOpen)
  return (
    <div className=" ">
      {isLoginOpen && (
        <>
          <AuthOverlay />
        </>
      )}{" "}
      {isEditProfileOpen && <EditProfileOverlay />}
    </div>
  )
}

export default App
