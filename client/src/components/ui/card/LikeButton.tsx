import { Spinner, Tooltip } from "@nextui-org/react"
import React, { useState } from "react"
import { Link } from "react-router-dom"
import MetaInfo from "../../meta-info/MetaInfo"
import { MdFavorite, MdOutlineFavoriteBorder } from "react-icons/md"
import { BASE_URL } from "../../../constants"
import { Like } from "../../../app/types"
import {
  useLikePostMutation,
  useUnlikePostMutation,
} from "../../../app/services/likeApi"
import { hasErrorField } from "../../../utils/has-error-field"
import defaultProfileAvatar from "../../../assets/images/profile.png"
import { useLazyGetPostByIdQuery } from "../../../app/services/postApi"

type Props = {
  likes: Like[]
  likedByUser: boolean
  refetchPosts: () => Promise<void>
  id: string
  setError: (error: string) => void
}

const LikeButton: React.FC<Props> = ({
  likes,
  likedByUser,
  refetchPosts,
  id,
  setError,
}) => {
  const [likePost, likePostStatus] = useLikePostMutation()
  const [unlikePost] = useUnlikePostMutation()
  const [loading, setLoading] = useState(false)

  const handleLike = async () => {
    setLoading(true)
    try {
      likedByUser
        ? await unlikePost(id).unwrap()
        : await likePost({ postId: id }).unwrap()
      await refetchPosts()

      setLoading(false)
    } catch (error) {
      if (hasErrorField(error)) {
        setError(error.data.error)
      } else {
        setError(error as string)
      }
      setLoading(false)
    }
  }

  return loading ? (
    <Spinner size="sm" color="secondary" />
  ) : (
    <Tooltip
      delay={250}
      classNames={{ content: ["bg-default-600/80 text-default-100"] }}
      placement="bottom-start"
      content={
        likes.length > 0 ? (
          <div className="flex flex-col gap-1">
            <p className="flex gap-1">
              <span>{likes.length}</span>
              {likes.length === 1 ? "person" : "people"} liked this post
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
                        className="size-8 object-cover rounded-full"
                        src={
                          like.user.avatarUrl
                            ? `${BASE_URL}${like.user.avatarUrl}`
                            : defaultProfileAvatar
                        }
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
      <button disabled={loading} onClick={handleLike}>
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
  )
}

export default LikeButton
