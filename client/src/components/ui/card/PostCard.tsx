import React, { useState } from "react"
import {
  CardBody,
  CardFooter,
  CardHeader,
  Image,
  Card as NextCard,
  Spinner,
} from "@nextui-org/react"
import {
  useLazyGetAllPostsQuery,
  useLazyGetFeedPostsQuery,
  useLazyGetPostByIdQuery,
} from "../../../app/services/postApi"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectCurrent } from "../../../features/userSlice"
import { formatToClientDate } from "../../../utils/format-to-client-date"
import User from "../../user/User"
import Typography from "../typography/Typography"
import ErrorMessage from "../error-message/ErrorMessage"
import { BASE_URL } from "../../../constants"
import { useLazyGetUserByIdQuery } from "../../../app/services/userApi"
import { Like } from "../../../app/types"
import LikeButton from "./LikeButton"
import CommentButton from "./CommentButton"
import ReplyButton from "./ReplyButton"
import DeleteButton from "./DeleteButton"

type Props = {
  avatarUrl: string
  name: string
  authorId: string
  content: string
  commentId?: string
  likes: Like[]
  commentsCount?: number
  createdAt?: Date
  id?: string
  cardFor: "comment" | "post" | "current-post" | "user-profile" | "feed"
  likedByUser?: boolean
  imageUrl?: string
  handleReply?: (name: string) => void
}

const Card: React.FC<Props> = ({
  avatarUrl = "",
  name = "",
  authorId = "",
  content = "",
  commentId = "",
  likes = [],
  commentsCount = 0,
  createdAt,
  id = "",
  cardFor = "post",
  likedByUser = false,
  handleReply,
  imageUrl,
}) => {
  const [triggerGetAllPosts] = useLazyGetAllPostsQuery()
  const [triggerGetPostById] = useLazyGetPostByIdQuery()
  const [triggerGetUserByIdQuery] = useLazyGetUserByIdQuery()
  const [triggerGetAllFeed] = useLazyGetFeedPostsQuery()
  const [error, setError] = useState("")
  const currentUser = useSelector(selectCurrent)

  const refetchPosts = async () => {
    switch (cardFor) {
      case "post":
        await triggerGetAllPosts().unwrap()
        break
      case "feed":
        await triggerGetAllFeed().unwrap()
        break
      case "current-post":
        await triggerGetPostById(id).unwrap()
        break
      case "comment":
        await triggerGetPostById(id).unwrap()
        break
      case "user-profile":
        await triggerGetUserByIdQuery(authorId).unwrap()
        break
      default:
        throw new Error("Wrong argument")
    }
  }

  return (
    <NextCard className="mb-6" shadow="sm">
      <CardHeader className="justify-between items-center bg-transparent">
        <Link to={`/users/${authorId}`}>
          <User
            name={name}
            avatarUrl={avatarUrl}
            description={createdAt && formatToClientDate(createdAt).toString()}
            className="text-small font-semibold leading-none text-default-600"
          />
        </Link>
        {authorId === currentUser?.id && (
          <DeleteButton
            cardFor={cardFor}
            commentId={commentId}
            id={id}
            refetchPosts={refetchPosts}
            setError={setError}
          />
        )}
      </CardHeader>
      <CardBody className="px-3 py-2 flex flex-col gap-4">
        <Typography size="text-md">{content}</Typography>
        {imageUrl && (
          <Image
            src={`${BASE_URL}${imageUrl}`}
            className="max-h-[300px] object-cover"
          />
        )}
      </CardBody>
      <CardFooter className="gap-3">
        <div className="flex gap-5 items-center ">
          {cardFor !== "comment" && (
            <>
              {cardFor !== "current-post" && (
                <CommentButton commentsCount={commentsCount} id={id} />
              )}

              <LikeButton
                likes={likes}
                likedByUser={likedByUser}
                id={id}
                refetchPosts={refetchPosts}
                setError={setError}
              />
            </>
          )}
          {handleReply && <ReplyButton name={name} handleReply={handleReply} />}
        </div>
        <ErrorMessage error={error} />
      </CardFooter>
    </NextCard>
  )
}

export default Card
