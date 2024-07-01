import { useLazyGetUserByIdQuery } from "../../app/services/userApi"
import { Button, Card, CardBody, CardHeader, Image } from "@nextui-org/react"
import { useSelector } from "react-redux"
import { selectCurrent } from "../../features/userSlice"
import {
  useFollowUserMutation,
  useUnfollowUserMutation,
} from "../../app/services/followApi"

import Back from "../../components/ui/back/Back"
import { BASE_URL } from "../../constants"
import {
  MdOutlinePersonAddAlt1,
  MdOutlinePersonAddDisabled,
} from "react-icons/md"
import { CiEdit, CiLocationOn } from "react-icons/ci"
import { formatToClientDay } from "../../utils/format-to-client-day"
import { FaBirthdayCake } from "react-icons/fa"
import { BsCalendar3 } from "react-icons/bs"
import { IoCheckmarkOutline } from "react-icons/io5"
import { User } from "../../app/types"
import ProfileItem from "./ProfileItem"

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

  const postsLength = data.userPosts.length
  const isCurrentUser = currentUser?.id === userId

  return (
    <>
      <Card className="flex-row p-2 mb-6" shadow="sm">
        <Back />
        <div className="flex flex-col">
          <div className="font-bold break-words max-w-[300px]">{data.name}</div>
          <div className="text-small text-default-400 flex">
            {postsLength}
            {postsLength === 1 ? " post" : " posts"}
          </div>
        </div>
      </Card>
      <Card className="p-3" shadow="sm">
        <CardHeader className="flex justify-between items-start">
          <Image
            src={`${BASE_URL}${data.avatarUrl}`}
            alt={data.name}
            width={200}
            height={200}
            className="border-4 border-foreground-800 "
          />
          <div className="flex flex-col items-end gap-4">
            <div className="flex flex-col items-end">
              <div className="text-2xl font-bold text-ellipsis break-words max-w-[300px]">
                {data.name}
              </div>
              <div className="text-lg ">{data.email}</div>
            </div>

            {!isCurrentUser ? (
              <div className="group w-[120px]">
                <Button
                  fullWidth
                  color={data.isFollowing ? "danger" : "primary"}
                  variant="flat"
                  className="gap-2 items-center hidden group-hover:flex"
                  onClick={handleFollow}
                  endContent={
                    data.isFollowing ? (
                      <MdOutlinePersonAddDisabled />
                    ) : (
                      <MdOutlinePersonAddAlt1 />
                    )
                  }
                >
                  {data.isFollowing ? "Unfollow" : "Follow"}
                </Button>
                <Button fullWidth className="group-hover:hidden ">
                  {data.isFollowing ? "Following" : "Not following"}
                </Button>
              </div>
            ) : (
              <Button onClick={() => onOpen()} endContent={<CiEdit />}>
                Edit profile
              </Button>
            )}
            <Button>
              <span>{data.following.length}</span>
              <span>following</span>
            </Button>
            <Button>
              <span>{data.followers.length}</span>
              <span>follower{data.followers.length !== 1 && "s"}</span>
            </Button>
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
