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
        <button className="font-semibold text-default-400 text-lg">
          {count}
        </button>
      )}
      <button className="text-default-400 text-xl">
        <Icon />
      </button>
    </div>
  )
}

export default MetaInfo
