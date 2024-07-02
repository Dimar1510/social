import React, { useState } from "react"
import {
  CardBody,
  CardFooter,
  CardHeader,
  Card as NextCard,
  Spinner,
  Tooltip,
} from "@nextui-org/react"
import {
  useLikePostMutation,
  useUnlikePostMutation,
} from "../../../app/services/likeApi"
import {
  useDeletePostMutation,
  useLazyGetAllPostsQuery,
  useLazyGetFeedPostsQuery,
  useLazyGetPostByIdQuery,
} from "../../../app/services/postApi"
import { useDeleteCommentMutation } from "../../../app/services/commentApi"
import { Link, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectCurrent } from "../../../features/userSlice"
import { formatToClientDate } from "../../../utils/format-to-client-date"
import User from "../../user"
import { RiDeleteBinLine } from "react-icons/ri"
import Typography from "../typography/Typography"
import MetaInfo from "../../meta-info"
import { FcDislike } from "react-icons/fc"
import { MdFavorite, MdOutlineFavoriteBorder } from "react-icons/md"
import { FaRegComment } from "react-icons/fa"
import ErrorMessage from "../error-message"
import { hasErrorField } from "../../../utils/has-error-field"
import { BASE_URL } from "../../../constants"
import { useLazyGetUserByIdQuery } from "../../../app/services/userApi"
import { Like } from "../../../app/types"
import { BsReply } from "react-icons/bs"

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
}) => {
  const [likePost] = useLikePostMutation()
  const [unlikePost] = useUnlikePostMutation()
  const [triggerGetAllPosts] = useLazyGetAllPostsQuery()
  const [triggerGetPostById] = useLazyGetPostByIdQuery()
  const [triggerGetUserByIdQuery] = useLazyGetUserByIdQuery()
  const [triggerGetAllFeed] = useLazyGetFeedPostsQuery()
  const [deletePost, deletePostStatus] = useDeletePostMutation()
  const [deleteComment, deleteCommentStatus] = useDeleteCommentMutation()
  const [error, setError] = useState("")
  const navigate = useNavigate()
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

  const handleLike = async () => {
    try {
      likedByUser
        ? await unlikePost(id).unwrap()
        : await likePost({ postId: id }).unwrap()

      await refetchPosts()
    } catch (error) {
      if (hasErrorField(error)) {
        setError(error.data.error)
      } else {
        setError(error as string)
      }
    }
  }

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
        )}
      </CardHeader>
      <CardBody className="px-3 py-2 ">
        <Typography size="text-md">{content}</Typography>
      </CardBody>
      <CardFooter className="gap-3">
        <div className="flex gap-5 items-center ">
          {cardFor !== "comment" && (
            <>
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
              <Tooltip
                delay={250}
                classNames={{ content: ["bg-default-600/80 text-default-100"] }}
                placement="bottom-start"
                content={
                  likes.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      <p className="flex gap-1">
                        <span>{likes.length}</span>
                        {likes.length === 1 ? "person" : "people"} liked this
                        post
                      </p>
                      <div className="flex gap-2">
                        {likes.map(
                          (like, index) =>
                            index < 5 && (
                              <Link
                                key={like.id}
                                to={`/users/${like.userId}`}
                                className="group relative"
                              >
                                <img
                                  className="size-8 object-cover"
                                  src={`${BASE_URL}${like.user.avatarUrl}`}
                                />
                                <div className="hidden group-hover:flex absolute w-max bg-black/70 px-2 py-1 rounded-md -top-5 z-20">
                                  {like.user.name}
                                </div>
                              </Link>
                            ),
                        )}
                      </div>
                    </div>
                  ) : (
                    "Like this post"
                  )
                }
              >
                <button onClick={handleLike}>
                  <MetaInfo
                    count={likes.length}
                    color={"#f91880"}
                    icon={
                      likedByUser ? (
                        <MdFavorite color="#f91880" />
                      ) : (
                        <MdOutlineFavoriteBorder />
                      )
                    }
                  />
                </button>
              </Tooltip>
            </>
          )}
          {handleReply && (
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
          )}
        </div>
        <ErrorMessage error={error} />
      </CardFooter>
    </NextCard>
  )
}

export default Card