import { Button } from "@nextui-org/react"
import {
  MdOutlinePersonAddAlt1,
  MdOutlinePersonAddDisabled,
} from "react-icons/md"
import { CiEdit } from "react-icons/ci"
import { User } from "../../app/types"
import { Link } from "react-router-dom"
import { Link as NextLink } from "@nextui-org/react"

type Props = {
  data: User
  handleFollow: () => void
  isCurrentUser: boolean
  onOpen: () => void
}

const ButtonGroup: React.FC<Props> = ({
  data,
  isCurrentUser,
  handleFollow,
  onOpen,
}) => {
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
