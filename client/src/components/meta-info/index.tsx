import React from "react"

type Props = {
  count: number
  icon: React.ReactElement
  color: string
}

const MetaInfo: React.FC<Props> = ({ count, icon, color }) => {
  return (
    <div
      className={`text-default-400 flex items-center gap-1 cursor-pointer hover:text-[${color}]`}
    >
      <div className="text-lg">{icon}</div>
      {count > 0 && <div className="font-semibold text-sm">{count}</div>}
    </div>
  )
}

export default MetaInfo
