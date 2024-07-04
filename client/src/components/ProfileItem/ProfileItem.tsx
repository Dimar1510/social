import React from "react"
import { User } from "../../app/types"
import { formatToClientDay } from "../../utils/format-to-client-day"

type Props = {
  item: User["bio"] | User["location"] | User["dateOfBirth"] | null
  isCurrentUser: boolean
  children: React.ReactNode
  icon?: React.ReactElement
  date?: boolean
}

const ProfileItem: React.FC<Props> = ({
  item,
  isCurrentUser,
  children,
  icon,
  date,
}) => {
  return (
    <li className="mb-4">
      <div className="text-sm text-default-400">
        {!item && isCurrentUser && (
          <span className="flex items-center">{children}</span>
        )}
      </div>
      {item && (
        <div className="flex items-center gap-2">
          {icon}
          {date ? formatToClientDay(item) : item}
        </div>
      )}
    </li>
  )
}

export default ProfileItem
