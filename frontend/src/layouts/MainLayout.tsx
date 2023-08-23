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
      <div
        className={[
          useLocation().pathname === "/" ? "max-w-[1140px]" : "",
          "flex justify-between mx-auto w-full lg:px-2.5 px-0",
        ].join(" ")}
      >
        <div>
          <SideNavMain />
        </div>
        {children}
      </div>
    </>
  )
}

export default MainLayout
