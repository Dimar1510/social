import { Spinner } from "@nextui-org/react"
import { useGetFeedPostsQuery } from "../../app/services/postApi"
import Card from "../../components/ui/card/PostCard"

const Feed = () => {
  const { data, isLoading } = useGetFeedPostsQuery()

  return isLoading ? (
    <div className="mt-[30%] flex justify-center">
      <Spinner className="scale-[2]" />
    </div>
  ) : (
    <>
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
        )}

      {data?.length === 0 && (
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
