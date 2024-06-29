import React from "react"

type Props = {
  title: string
  info?: string
}

const ProfileInfo: React.FC<Props> = ({ title, info }) => {
  return (
    <p className="font-semibold">
      <span className="text-gray-500 mr-2">{title}</span>
      {!info && <span className="font-light">n/a</span>}
      {info}
    </p>
  )
}

export default ProfileInfo
