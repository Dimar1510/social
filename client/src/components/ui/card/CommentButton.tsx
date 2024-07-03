import { Tooltip } from "@nextui-org/react"
import React from "react"
import MetaInfo from "../../meta-info/MetaInfo"
import { Link } from "react-router-dom"
import { FaRegComment } from "react-icons/fa"

type Props = {
  id: string
  commentsCount: number
}

const CommentButton: React.FC<Props> = ({ id, commentsCount }) => {
  return (
    <Tooltip
      delay={250}
      classNames={{ content: ["bg-default-600/80 text-default-100"] }}
      placement="bottom-start"
      content={`Comments`}
    >
      <Link to={`/posts/${id}`}>
        <MetaInfo
          color={"#1d9bf0"}
          count={commentsCount}
          icon={<FaRegComment />}
        />
      </Link>
    </Tooltip>
  )
}

export default CommentButton
