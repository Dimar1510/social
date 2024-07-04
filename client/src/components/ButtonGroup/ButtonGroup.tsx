import { Button } from "@nextui-org/react"
import {
  MdOutlinePersonAddAlt1,
  MdOutlinePersonAddDisabled,
} from "react-icons/md"
import { CiEdit } from "react-icons/ci"
import { User } from "../../app/types"
import { Link as NextLink } from "@nextui-org/react"
import {
  useFollowUserMutation,
  useUnfollowUserMutation,
} from "../../app/services/followApi"
import { useLazyGetUserByIdQuery } from "../../app/services/userApi"
import { useState } from "react"

type Props = {
  data: User
  isCurrentUser: boolean
  onOpen: () => void
  userId?: string
}

const ButtonGroup: React.FC<Props> = ({
  isCurrentUser,
  onOpen,
  userId,
  data,
}) => {
  const [followUser] = useFollowUserMutation()
  const [unfollowUser] = useUnfollowUserMutation()
  const [triggerGetUserByIdQuery] = useLazyGetUserByIdQuery()
  const [loading, setLoading] = useState(false)

  if (!data) return null

  const handleFollow = async () => {
    setLoading(true)
    try {
      if (userId) {
        data.isFollowing
          ? await unfollowUser(userId).unwrap()
          : await followUser({ followingId: userId }).unwrap()
        await triggerGetUserByIdQuery(userId)
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        {!isCurrentUser ? (
          <div className="group w-[120px]">
            <Button
              fullWidth
              color={data.isFollowing ? "danger" : "primary"}
              variant="flat"
              className="gap-2 items-center hidden group-hover:flex"
              onClick={handleFollow}
              isLoading={loading}
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
            <Button
              isLoading={loading}
              fullWidth
              className="group-hover:hidden "
            >
              {data.isFollowing ? "Following" : "Not following"}
            </Button>
          </div>
        ) : (
          <Button onClick={() => onOpen()} endContent={<CiEdit />}>
            Edit profile
          </Button>
        )}
        <Button as={NextLink} href={`/following/${data.id}`}>
          <span>{data.following.length}</span>
          <span>following</span>
        </Button>
        <Button as={NextLink} href={`/followers/${data.id}`}>
          <span>{data.followers.length}</span>
          <span>follower{data.followers.length !== 1 && "s"}</span>
        </Button>
      </div>
    </>
  )
}

export default ButtonGroup
