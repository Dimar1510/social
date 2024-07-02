import { useLazyGetUserByIdQuery } from "../../app/services/userApi"
import { Card, CardBody, CardHeader, Image } from "@nextui-org/react"
import { useSelector } from "react-redux"
import { selectCurrent } from "../../features/userSlice"
import {
  useFollowUserMutation,
  useUnfollowUserMutation,
} from "../../app/services/followApi"
import { BASE_URL } from "../../constants"
import { CiLocationOn } from "react-icons/ci"
import { formatToClientDay } from "../../utils/format-to-client-day"
import { FaBirthdayCake } from "react-icons/fa"
import { BsCalendar3 } from "react-icons/bs"
import { IoCheckmarkOutline } from "react-icons/io5"
import { User } from "../../app/types"
import ProfileItem from "./ProfileItem"
import ButtonGroup from "./ButtonGroup"

type Props = {
  data: User
  onOpen: () => void

  userId: string | undefined
}

const UserCard: React.FC<Props> = ({ data, userId, onOpen }) => {
  const currentUser = useSelector(selectCurrent)
  const [followUser] = useFollowUserMutation()
  const [unfollowUser] = useUnfollowUserMutation()
  const [triggerGetUserByIdQuery] = useLazyGetUserByIdQuery()

  const handleFollow = async () => {
    try {
      if (userId) {
        data.isFollowing
          ? await unfollowUser(userId).unwrap()
          : await followUser({ followingId: userId }).unwrap()
        await triggerGetUserByIdQuery(userId)
      }
    } catch (error) {}
  }

  const isCurrentUser = currentUser?.id === userId

  return (
    <>
      <Card className="p-3" shadow="sm">
        <CardHeader className="flex justify-between items-center xs:items-start flex-col xs:flex-row">
          <Image
            src={`${BASE_URL}${data.avatarUrl}`}
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
              handleFollow={handleFollow}
              onOpen={onOpen}
              isCurrentUser={isCurrentUser}
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
        </CardBody>
      </Card>
    </>
  )
}

export default UserCard
