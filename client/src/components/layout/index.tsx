import { Outlet } from "react-router-dom"
import Header from "../header"
import Navbar from "../navbar"
import Wrapper from "../wrapper"

const Layout = () => {
  return (
    <>
      <Header />
      <Wrapper>
        <div className="flex-2 p-4">
          <Navbar />
        </div>
        <div className="flex-1 p-4">
          <Outlet />
        </div>
      </Wrapper>
    </>
  )
}

export default Layout
