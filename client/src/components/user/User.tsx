import React from "react"
import { User as NextUser } from "@nextui-org/react"
import { BASE_URL } from "../../constants"
import defaultProfileAvatar from "../../assets/images/profile.png"
type Props = {
  name?: string
  avatarUrl?: string
  description?: string
  className?: string
}

const User: React.FC<Props> = ({
  name = "",
  avatarUrl = "",
  description = "",
  className = "",
}) => {
  return (
    <NextUser
      name={name}
      className={className}
      description={description}
      avatarProps={{
        src: avatarUrl ? `${BASE_URL}${avatarUrl}` : defaultProfileAvatar,
      }}
    />
  )
}

export default User
