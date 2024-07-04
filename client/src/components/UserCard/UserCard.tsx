import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Image,
  Switch,
} from "@nextui-org/react"
import { useDispatch, useSelector } from "react-redux"
import { logout, selectCurrent } from "../../features/userSlice"
import { BASE_URL } from "../../constants"
import { CiLocationOn, CiLogout } from "react-icons/ci"
import { formatToClientDay } from "../../utils/format-to-client-day"
import { FaBirthdayCake, FaRegMoon } from "react-icons/fa"
import { BsCalendar3 } from "react-icons/bs"
import { IoCheckmarkOutline } from "react-icons/io5"
import { User } from "../../app/types"
import ProfileItem from "../ProfileItem/ProfileItem"
import ButtonGroup from "../ButtonGroup/ButtonGroup"
import defaultProfileAvatar from "../../assets/images/profile.png"
import { LuSunMedium } from "react-icons/lu"
import { useNavigate } from "react-router-dom"
import { useContext } from "react"
import { ThemeContext } from "../theme-provider"

type Props = {
  data: User
  onOpen: () => void

  userId: string | undefined
}

const UserCard: React.FC<Props> = ({ data, userId, onOpen }) => {
  const currentUser = useSelector(selectCurrent)
  const isCurrentUser = currentUser?.id === userId
  const { theme, toggleTheme } = useContext(ThemeContext)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    localStorage.removeItem("token")
    navigate("/auth")
  }

  const themeSelected = theme === "light"
  return (
    <>
      <Card className="p-3" shadow="sm">
        <CardHeader className="flex justify-between items-center xs:items-start flex-col xs:flex-row">
          <Image
            src={
              data.avatarUrl
                ? `${BASE_URL}${data.avatarUrl}`
                : defaultProfileAvatar
            }
            alt={data.name}
            width={200}
            height={200}
            className="border-4 border-foreground-800 "
          />
          <div className="flex flex-col items-center xs:items-end gap-4">
            <div className="flex flex-col items-center xs:items-end">
              <div className="text-2xl font-bold break-all max-w-[300px] text-center xs:text-right">
                {data.name}
              </div>
              <div className="text-lg text-ellipsis break-all ">
                {data.email}
              </div>
            </div>
            <ButtonGroup
              data={data}
              onOpen={onOpen}
              isCurrentUser={isCurrentUser}
              userId={userId}
            />
          </div>
        </CardHeader>
        <CardBody className="flex flex-col gap-2">
          {!data.bio ||
            !data.dateOfBirth ||
            (!data.location && isCurrentUser && (
              <div className="text-sm text-default-400">
                You can finish filling out your profile:
              </div>
            ))}

          <ul>
            <ProfileItem item={data.bio} isCurrentUser={isCurrentUser}>
              <IoCheckmarkOutline />
              Tell something about yourself
            </ProfileItem>
            <ProfileItem
              item={data.location}
              isCurrentUser={isCurrentUser}
              icon={<CiLocationOn />}
            >
              <IoCheckmarkOutline />
              Add your location
            </ProfileItem>

            <ProfileItem
              item={data.dateOfBirth}
              isCurrentUser={isCurrentUser}
              icon={<FaBirthdayCake />}
              date={true}
            >
              <IoCheckmarkOutline />
              Add your birthday
            </ProfileItem>
            <li>
              <div className="flex items-center gap-2 text-sm text-default-400">
                <BsCalendar3 />
                Account created: {formatToClientDay(data.createdAt)}
              </div>
            </li>
          </ul>
          {isCurrentUser && (
            <div className="flex-row-reverse flex justify-between">
              <Button
                color="default"
                variant="flat"
                className=""
                onClick={handleLogout}
              >
                <CiLogout />
                <span className="">Logout</span>
              </Button>

              <Switch
                isSelected={!themeSelected}
                size="md"
                onValueChange={toggleTheme}
                endContent={<LuSunMedium />}
                startContent={<FaRegMoon />}
                className=""
              ></Switch>
            </div>
          )}
        </CardBody>
      </Card>
    </>
  )
}

export default UserCard
