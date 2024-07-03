import { Spinner, Tooltip } from "@nextui-org/react"
import React from "react"
import { RiDeleteBinLine } from "react-icons/ri"
import { useDeletePostMutation } from "../../../app/services/postApi"
import { useDeleteCommentMutation } from "../../../app/services/commentApi"
import { useNavigate } from "react-router-dom"
import { hasErrorField } from "../../../utils/has-error-field"

type Props = {
  cardFor: string
  refetchPosts: () => Promise<void>
  id: string
  commentId: string
  setError: (error: string) => void
}

const DeleteButton: React.FC<Props> = ({
  cardFor,
  refetchPosts,
  id,
  commentId,
  setError,
}) => {
  const [deletePost, deletePostStatus] = useDeletePostMutation()
  const [deleteComment, deleteCommentStatus] = useDeleteCommentMutation()
  const navigate = useNavigate()

  const handleDelete = async () => {
    try {
      switch (cardFor) {
        case "user-profile":
          await deletePost(id).unwrap()
          await refetchPosts()
          break
        case "post":
          await deletePost(id).unwrap()
          await refetchPosts()
          break
        case "current-post":
          await deletePost(id).unwrap()
          navigate("/")
          break
        case "comment":
          await deleteComment(commentId).unwrap()
          await refetchPosts()
          break
        default:
          throw new Error("Wrong argument")
      }
    } catch (error) {
      if (hasErrorField(error)) {
        setError(error.data.error)
      } else {
        setError(error as string)
      }
    }
  }
  return (
    <Tooltip
      delay={250}
      classNames={{ content: ["bg-default-600/80 text-default-100"] }}
      placement="bottom-end"
      content={`Delete this ${cardFor === "comment" ? "comment" : "post"}`}
    >
      <button className="cursor-pointer" onClick={handleDelete}>
        {deletePostStatus.isLoading || deleteCommentStatus.isLoading ? (
          <Spinner />
        ) : (
          <RiDeleteBinLine />
        )}
      </button>
    </Tooltip>
  )
}

export default DeleteButton
