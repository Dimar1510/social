import { Outlet, useNavigate } from "react-router-dom"
import Sidebar from "../Sidebar/Sidebar"
import Wrapper from "../wrapper/Wrapper"
import { useAppSelector as useSelector } from "../../app/hooks"
import { selectIsAuthenticated } from "../../features/userSlice"
import { useEffect } from "react"

const Layout = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth")
    }
  }, [isAuthenticated, navigate])
  return (
    <>
      <Wrapper>
        <header className="fixed pt-4 z-50 bg-background h-[80px] xs:h-full bottom-0 w-full xs:w-fit">
          <Sidebar />
        </header>
        <main className="xs:ml-[80px] sm:ml-[220px] flex-1 p-4">
          <Outlet />
        </main>
      </Wrapper>
    </>
  )
}

export default Layout
