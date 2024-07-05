import { Button, Divider } from "@nextui-org/react"
import User from "../../components/user/User"
import React, { useState } from "react"
import { MdOutlinePersonAddDisabled } from "react-icons/md"
import { Link } from "react-router-dom"
import { User as UserType } from "../../app/types"

type Props = {
  isCurrentUser: boolean
  loading: boolean
  data: UserType
  user: any
  handleFollow: (userId: string, id: string) => Promise<void>
}

const FollowingCard: React.FC<Props> = ({
  user,
  isCurrentUser,
  loading,
  data,
  handleFollow,
}) => {
  const [deleteCard, setDeleteCard] = useState(false)

  return (
    !deleteCard && (
      <div key={user.following.id}>
        <div className="flex justify-between w-full items-center">
          <Link to={`/users/${user.following.id}`}>
            <User
              className="my-6"
              name={user.following.name ?? ""}
              avatarUrl={user.following.avatarUrl ?? ""}
              description={user.following.email ?? ""}
            />
          </Link>
          {isCurrentUser && (
            <Button
              disabled={loading}
              variant="flat"
              className="items-center hover:bg-danger-200"
              onClick={() => {
                setDeleteCard(true)
                handleFollow(user.followingId, data.id)
              }}
              endContent={<MdOutlinePersonAddDisabled />}
            >
              Unfollow
            </Button>
          )}
        </div>
        <Divider />
      </div>
    )
  )
}

export default FollowingCard
