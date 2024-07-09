import { Tooltip, user } from "@nextui-org/react"
import React, { useEffect, useState } from "react"
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
  const [likePost] = useLikePostMutation()
  const [unlikePost] = useUnlikePostMutation()
  const [loading, setLoading] = useState(false)
  const [showLikes, setShowLikes] = useState(likes.length)
  const [showLikedByUser, setShowLikedByUser] = useState(likedByUser)

  useEffect(() => {
    setShowLikes(likes.length)
  }, [likes])

  useEffect(() => {
    setShowLikedByUser(likedByUser)
  }, [likedByUser])

  const handleLike = async () => {
    setLoading(true)
    likedByUser ? setShowLikes(showLikes - 1) : setShowLikes(showLikes + 1)
    setShowLikedByUser(!showLikedByUser)
    try {
      likedByUser
        ? await unlikePost(id).unwrap()
        : await likePost({ postId: id }).unwrap()
      await refetchPosts()
      setLoading(false)
      setShowLikes(likes.length)
      setShowLikedByUser(likedByUser)
    } catch (error) {
      if (hasErrorField(error)) {
        setError(error.data.error)
      } else {
        setError(error as string)
      }
      setLoading(false)
      setShowLikes(showLikes)
      setShowLikedByUser(showLikedByUser)
    }
  }

  return (
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
                        alt={user.name}
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
          count={showLikes}
          color={"#f91880"}
          icon={
            showLikedByUser ? (
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
