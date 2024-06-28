import React from "react"
import { IconType } from "react-icons"

type Props = {
  count: number
  Icon: IconType
}

const MetaInfo: React.FC<Props> = ({ count, Icon }) => {
  return (
    <div className="flex items-center gap-2 cursor-pointer">
      {count > 0 && (
        <div className="font-semibold text-default-400 text-lg">{count}</div>
      )}
      <div className="text-default-400 text-lg">
        <Icon />
      </div>
    </div>
  )
}

export default MetaInfo
