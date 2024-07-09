import { useGetFeedPostsQuery } from "../../app/services/postApi"
import Card from "../../components/ui/card/PostCard"
import PostSkeleton from "../../components/ui/Skeleton/PostSkeleton"

const Feed = () => {
  const { data, isLoading } = useGetFeedPostsQuery()
  const voidArr = new Array(5).fill("")

  return isLoading ? (
    voidArr.map((e, i) => <PostSkeleton key={i} />)
  ) : (
    <div className="mb-20 xs:mb-0">
      {data &&
        data.length > 0 &&
        data.map(
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
              cardFor="feed"
              imageUrl={imageUrl}
            />
          ),
        )}

      {data?.length === 0 && (
        <div className="flex-row justify-center p-2 mt-20 w-full">
          <h2 className="text-xl text-center">
            Start following someone to see their posts in your feed
          </h2>
        </div>
      )}
    </div>
  )
}

export default Feed
