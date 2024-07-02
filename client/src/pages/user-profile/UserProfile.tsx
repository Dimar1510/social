import { useParams } from "react-router-dom"
import {
  useGetUserByIdQuery,
  useLazyCurrentQuery,
  useLazyGetUserByIdQuery,
} from "../../app/services/userApi"
import { Card, useDisclosure } from "@nextui-org/react"
import { useDispatch } from "react-redux"
import { resetUser } from "../../features/userSlice"
import { useEffect } from "react"
import EditProfile from "../../components/edit-profile/EditProfile"
import PostCard from "../../components/ui/card"
import UserCard from "./UserCard"
import Back from "../../components/ui/back/Back"

const UserProfile = () => {
  const params = useParams<{ id: string }>()
  const { data } = useGetUserByIdQuery(params?.id ?? "")
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [triggerGetUserByIdQuery] = useLazyGetUserByIdQuery()
  const [triggerCurrentQuery] = useLazyCurrentQuery()

  const dispatch = useDispatch()

  useEffect(
    () => () => {
      dispatch(resetUser())
    },
    [],
  )

  if (!data) {
    return <h2>User not found</h2>
  }

  const handleClose = async () => {
    try {
      if (params?.id) {
        await triggerGetUserByIdQuery(params?.id)
        await triggerCurrentQuery()
        onClose()
      }
    } catch (error) {
      console.error(error)
    }
  }
  const postsLength = data.userPosts.length
  return (
    <>
      <Card className="flex-row p-2 mb-6" shadow="sm">
        <Back />
        <div className="flex flex-col">
          <div className="font-bold max-w-[300px] text-ellipsis break-words">
            {data.name}
          </div>
          <div className="text-small text-default-400 flex">
            {postsLength}
            {postsLength === 1 ? " post" : " posts"}
          </div>
        </div>
      </Card>
      <UserCard data={data} onOpen={onOpen} userId={params?.id} />

      <EditProfile isOpen={isOpen} onClose={handleClose} user={data} />
      <div className="mt-6">
        {data.userPosts && data.userPosts.length > 0
          ? data.userPosts.map(
              ({
                content,
                author,
                id,
                authorId,
                comments,
                likes,
                likedByUser,
                createdAt,
              }) => (
                <PostCard
                  key={id}
                  avatarUrl={author.avatarUrl ?? ""}
                  content={content}
                  name={author.name ?? ""}
                  likes={likes}
                  commentsCount={comments.length}
                  authorId={authorId}
                  id={id}
                  likedByUser={likedByUser}
                  createdAt={createdAt}
                  cardFor="user-profile"
                />
              ),
            )
          : null}
      </div>
    </>
  )
}

export default UserProfile
