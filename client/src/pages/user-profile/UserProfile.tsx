import { useParams } from "react-router-dom"
import {
  useGetUserByIdQuery,
  useLazyCurrentQuery,
  useLazyGetUserByIdQuery,
} from "../../app/services/userApi"
import { Card, Skeleton, useDisclosure } from "@nextui-org/react"
import {
  useAppDispatch as useDispatch,
  useAppSelector as useSelector,
} from "../../app/hooks"
import { resetUser, selectCurrent } from "../../features/userSlice"
import { useEffect } from "react"
import EditProfile from "../../components/edit-profile/EditProfile"
import PostCard from "../../components/ui/card/PostCard"
import UserCard from "../../components/UserCard/UserCard"
import Back from "../../components/ui/back/Back"
import PostSkeleton from "../../components/ui/Skeleton/PostSkeleton"

const UserProfile = () => {
  const params = useParams<{ id: string }>()
  const { data } = useGetUserByIdQuery(params?.id ?? "")
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [triggerGetUserByIdQuery] = useLazyGetUserByIdQuery()
  const [triggerCurrentQuery] = useLazyCurrentQuery()
  const currentUser = useSelector(selectCurrent)
  const dispatch = useDispatch()

  useEffect(
    () => () => {
      dispatch(resetUser())
    },
    [dispatch],
  )

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleUpdate = async () => {
    try {
      if (params?.id) {
        onClose()
        await triggerGetUserByIdQuery(params?.id)
        await triggerCurrentQuery()
      }
    } catch (error) {
      console.error(error)
    }
  }
  const voidArr = new Array(3).fill("")

  return (
    <>
      <Card className="flex-row p-2 mb-6" shadow="sm">
        <Back />
        {data ? (
          <div className="flex flex-col">
            <div className="font-bold text-ellipsis break-all">{data.name}</div>
            <div className="text-small text-default-400 flex">
              {data.userPosts.length}
              {data.userPosts.length === 1 ? " post" : " posts"}
            </div>
          </div>
        ) : (
          <>
            <Skeleton className="h-3 w-10" /> <Skeleton className="h-3 w-10" />
          </>
        )}
      </Card>
      {data ? (
        <UserCard data={data} onOpen={onOpen} userId={params?.id} />
      ) : (
        <Card className="h-60 w-full mb-6 flex justify-between items-center xs:items-start flex-col xs:flex-row p-6">
          <Skeleton className="size-[200px] rounded-lg" />
          <div className="flex flex-col items-center xs:items-end gap-4">
            <Skeleton className="h-10 w-32 rounded-lg mt-6" />
            <Skeleton className="h-10 w-32 rounded-lg" />
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
        </Card>
      )}

      <EditProfile
        isOpen={isOpen}
        handleUpdate={handleUpdate}
        onClose={onClose}
        user={currentUser}
      />
      {data ? (
        <div className="mt-6 mb-20 xs:mb-0">
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
                  imageUrl,
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
                    imageUrl={imageUrl}
                  />
                ),
              )
            : null}
        </div>
      ) : (
        voidArr.map((e, i) => <PostSkeleton key={i} />)
      )}
    </>
  )
}

export default UserProfile
