import { Tooltip } from "@nextui-org/react"
import React from "react"
import MetaInfo from "../../meta-info/MetaInfo"
import { BsReply } from "react-icons/bs"

type Props = {
  handleReply: (name: string) => void
  name: string
}

const ReplyButton: React.FC<Props> = ({ name, handleReply }) => {
  return (
    <Tooltip
      delay={250}
      classNames={{ content: ["bg-default-600/80 text-default-100"] }}
      placement="bottom-start"
      content={`Reply to user`}
    >
      <button onClick={() => handleReply(name)}>
        <MetaInfo color={"#388a72"} count={0} icon={<BsReply />} />
      </button>
    </Tooltip>
  )
}

export default ReplyButton
