// ProtectedRoute.js
import { ReactNode, useEffect } from "react"

import { useNavigate } from "react-router-dom"
import { useUserStore } from "../stores/userStore"
import useGeneralStore from "../stores/generalStore"

const ProtectedRoutes = ({ children }: { children: ReactNode }) => {
  const user = useUserStore((state) => state)
  const navigate = useNavigate()
  const setLoginIsOpen = useGeneralStore((state) => state.setLoginIsOpen)
  useEffect(() => {
    if (!user.id) {
      navigate("/") // or your login page
      setLoginIsOpen(true)
    }
  }, [user.id, navigate, setLoginIsOpen])

  if (!user.id) {
    return null
  }

  return children
}

export default ProtectedRoutes
