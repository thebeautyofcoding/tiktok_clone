import React from "react"
import TopNav from "../components/TopNav"
import { useLocation } from "react-router-dom"
import SideNavMain from "../components/SideNavMain"
function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header>
        <TopNav />
      </header>
      <div>
        <div>
          <SideNavMain />
        </div>
        {children}
      </div>
    </>
  )
}

export default MainLayout
