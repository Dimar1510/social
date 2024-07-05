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
import { useEffect, useState } from "react"

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
  const [followersCount, setFollowersCount] = useState(data.followers.length)
  const [showFollowing, setShowFollowing] = useState(data.isFollowing)

  if (!data) return null

  useEffect(() => {
    setShowFollowing(data.isFollowing)
    setFollowersCount(data.followers.length)
  }, [data])

  const handleFollow = async () => {
    showFollowing
      ? setFollowersCount(followersCount - 1)
      : setFollowersCount(followersCount + 1)
    setShowFollowing(!showFollowing)
    setLoading(true)
    try {
      if (userId) {
        data.isFollowing
          ? await unfollowUser(userId).unwrap()
          : await followUser({ followingId: userId }).unwrap()
        // await triggerGetUserByIdQuery(userId)
        setLoading(false)
      }
    } catch (error) {
      setFollowersCount(followersCount)
      setShowFollowing(showFollowing)
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
              color={showFollowing ? "danger" : "primary"}
              variant="flat"
              className="gap-2 items-center hidden group-hover:flex"
              onClick={handleFollow}
              disabled={loading}
              endContent={
                showFollowing ? (
                  <MdOutlinePersonAddDisabled />
                ) : (
                  <MdOutlinePersonAddAlt1 />
                )
              }
            >
              {data.isFollowing ? "Unfollow" : "Follow"}
            </Button>
            <Button
              disabled={loading}
              fullWidth
              className="group-hover:hidden "
            >
              {showFollowing ? "✔ Following" : "Not following"}
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
          <span>{followersCount}</span>
          <span>follower{followersCount !== 1 && "s"}</span>
        </Button>
      </div>
    </>
  )
}

export default ButtonGroup
