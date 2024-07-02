import { useGetFeedPostsQuery } from "../../app/services/postApi"
import Card from "../../components/ui/card/PostCard"

const Feed = () => {
  const { data } = useGetFeedPostsQuery()
  return (
    <>
      {data && data.length > 0 ? (
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
            />
          ),
        )
      ) : (
        <div className="flex-row justify-center p-2 mt-20 w-full">
          <h2 className="text-xl text-center">
            Start following someone to see their posts in your feed
          </h2>
        </div>
      )}
    </>
  )
}

export default Feed
