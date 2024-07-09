import { useGetAllPostsQuery } from "../../app/services/postApi"
import CreatePost from "../../components/createPost/CreatePost"
import Card from "../../components/ui/card/PostCard"
import { usePrefetch } from "../../app/services/userApi"
import { useAppSelector as useSelector } from "../../app/hooks"
import { selectCurrent } from "../../features/userSlice"
import PostSkeleton from "../../components/ui/Skeleton/PostSkeleton"

const Posts = () => {
  const current = useSelector(selectCurrent)
  const { data, isLoading } = useGetAllPostsQuery()
  const prefetchUser = usePrefetch("getUserById")
  if (current) prefetchUser(current.id)
  const voidArr = new Array(5).fill("")
  return (
    <>
      <div className="mb-10 w-full">
        <CreatePost />
      </div>
      {isLoading ? (
        voidArr.map((e, i) => <PostSkeleton key={i} />)
      ) : (
        <div className="mb-20 xs:mb-0">
          {data && data.length > 0
            ? data.map(
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
                  <Card
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
                    cardFor="post"
                    imageUrl={imageUrl}
                  />
                ),
              )
            : null}
        </div>
      )}
    </>
  )
}

export default Posts
