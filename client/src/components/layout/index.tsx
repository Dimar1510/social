import { Outlet, useNavigate } from "react-router-dom"
import Header from "../header"
import Navbar from "../navbar"
import Wrapper from "../wrapper"
import { useSelector } from "react-redux"
import { selectIsAuthenticated, selectUser } from "../../features/userSlice"
import { useEffect } from "react"
import Profile from "../profile"
import { Footer } from "../footer/Footer"

const Layout = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const user = useSelector(selectUser)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth")
    }
  }, [])
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
        <div className="flex-2 p-4">
          <div className="flex flex-col gap-5">{!user && <Profile />}</div>
        </div>
      </Wrapper>
      <Footer />
    </>
  )
}

export default Layout
