import { Button, Switch, useDisclosure } from "@nextui-org/react"
import { useContext, useEffect } from "react"
import Login from "../../features/Login"
import Register from "../../features/Register"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { selectIsAuthenticated } from "../../features/userSlice"
import { GiBirdTwitter } from "react-icons/gi"
import { ThemeContext } from "../../components/theme-provider"
import { FaRegMoon } from "react-icons/fa"
import { LuSunMedium } from "react-icons/lu"
import { Footer } from "../../components/footer/Footer"

const Auth = () => {
  const registerModal = useDisclosure()
  const loginModal = useDisclosure()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const navigate = useNavigate()
  const { theme, toggleTheme } = useContext(ThemeContext)

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/")
    }
  }, [])

  const themeSelected = theme === "light"

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="flex-1 flex w-full max-w-[1200px] justify-center items-center gap-8 p-8">
          <div className="text-clampLogo hidden sm:block">
            <GiBirdTwitter />
          </div>

          <div className="flex flex-col items-center sm:items-start gap-4">
            <h1 className="text-4xl sm:text-6xl uppercase flex gap-2">
              <span className="sm:hidden">
                <GiBirdTwitter />
              </span>
              Chirickter
            </h1>
            <h2 className="text-2xl sm:text-4xl mb-8 text-center">
              Digital communication platform
            </h2>
            <p className="text-xl font-semibold">Join today</p>
            <div className="flex flex-col gap-12 w-2/3 min-w-[250px]">
              <Button color="primary" onClick={() => registerModal.onOpen()}>
                Register
              </Button>
              <div className="flex flex-col gap-4">
                <p className="text-small font-semibold text-center sm:text-start">
                  Already have an account?
                </p>
                <Button
                  color="primary"
                  variant="bordered"
                  onClick={() => loginModal.onOpen()}
                >
                  Sign in
                </Button>
              </div>

              <Switch
                isSelected={!themeSelected}
                size="md"
                onValueChange={toggleTheme}
                endContent={<LuSunMedium />}
                startContent={<FaRegMoon />}
                className="self-center sm:self-start"
              >
                <span className="text-sm up">Dark mode</span>
              </Switch>
            </div>
          </div>
        </div>
        <Footer />
      </div>
      <Register isOpen={registerModal.isOpen} onClose={registerModal.onClose} />
      <Login isOpen={loginModal.isOpen} onClose={loginModal.onClose} />
    </>
  )
}

export default Auth
