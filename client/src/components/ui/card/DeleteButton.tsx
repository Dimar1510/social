import { Spinner, Tooltip } from "@nextui-org/react"
import React, { useState } from "react"
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
  setDeleteCard: (arg: boolean) => void
}

const DeleteButton: React.FC<Props> = ({
  cardFor,
  refetchPosts,
  id,
  commentId,
  setError,
  setDeleteCard,
}) => {
  const [deletePost] = useDeletePostMutation()
  const [deleteComment] = useDeleteCommentMutation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      switch (cardFor) {
        case "user-profile":
          setDeleteCard(true)
          await deletePost(id).unwrap()
          // await refetchPosts()
          break
        case "post":
          setDeleteCard(true)
          await deletePost(id).unwrap()
          // await refetchPosts()
          break
        case "current-post":
          await deletePost(id).unwrap()
          navigate("/")
          break
        case "comment":
          setDeleteCard(true)
          await deleteComment(commentId).unwrap()
          // await refetchPosts()
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
      setLoading(false)
      setDeleteCard(false)
    }
  }
  return (
    <Tooltip
      delay={250}
      classNames={{ content: ["bg-default-600/80 text-default-100"] }}
      placement="bottom-end"
      content={`Delete this ${cardFor === "comment" ? "comment" : "post"}`}
    >
      <button disabled={loading} onClick={handleDelete}>
        {loading ? <Spinner size="sm" /> : <RiDeleteBinLine />}
      </button>
    </Tooltip>
  )
}

export default DeleteButton
