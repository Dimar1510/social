import { FaRegMoon } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { selectCurrent } from "../../features/userSlice"
import { Button, Card, CardBody, Switch } from "@nextui-org/react"
import User from "../user/User"
import { User as NextUser } from "@nextui-org/react"
import { Link, useNavigate } from "react-router-dom"
import { useContext } from "react"
import { ThemeContext } from "../theme-provider"
import { LuSunMedium } from "react-icons/lu"
import { logout, selectIsAuthenticated } from "../../features/userSlice"
import { CiLogout } from "react-icons/ci"
import { BASE_URL } from "../../constants"
import defaultProfileAvatar from "../../assets/images/profile.png"

const UserControl = () => {
  const current = useSelector(selectCurrent)
  const { theme, toggleTheme } = useContext(ThemeContext)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isAuthenticated = useSelector(selectIsAuthenticated)

  const handleLogout = () => {
    dispatch(logout())
    localStorage.removeItem("token")
    navigate("/auth")
  }

  if (!current) {
    return null
  }

  const { name, email, avatarUrl, id } = current

  const themeSelected = theme === "light"

  return (
    <div className="flex flex-col gap-2 justify-start short:mb-6">
      <Link to={`/users/${id}`}>
        <Card className=" bg-transparent hover:bg-content1 " shadow="none">
          <CardBody className="p-0">
            <User
              name={name}
              description={email}
              avatarUrl={avatarUrl}
              className="max-w-[200px] justify-start truncate text-clip overflow-hidden hidden sm:flex"
            />
            <NextUser
              name={""}
              description={""}
              avatarProps={{
                src: avatarUrl
                  ? `${BASE_URL}${avatarUrl}`
                  : defaultProfileAvatar,
              }}
              className="sm:hidden"
            />
          </CardBody>
        </Card>
      </Link>
      <div className="xs:flex xs:flex-col-reverse sm:flex-row justify-between items-center mb-8 gap-4 hidden short:hidden ">
        {isAuthenticated && (
          <Button
            color="default"
            variant="flat"
            className="gap-2 flex-end hidden xs:flex sm:w-4/5 p-4 min-w-fit self-start sm:ml-0"
            onClick={handleLogout}
          >
            <CiLogout />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        )}{" "}
        <Switch
          isSelected={!themeSelected}
          size="md"
          onValueChange={toggleTheme}
          endContent={<LuSunMedium />}
          startContent={<FaRegMoon />}
          className="hidden xs:block mt-2"
        ></Switch>
      </div>
    </div>
  )
}

export default UserControl
