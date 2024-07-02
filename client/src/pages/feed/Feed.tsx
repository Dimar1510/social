import {
  useGetAllPostsQuery,
  useGetFeedPostsQuery,
} from "../../app/services/postApi"
import Card from "../../components/ui/card"
import { Card as NextCard } from "@nextui-org/react"

const Feed = () => {
  const { data } = useGetFeedPostsQuery()
  return (
    <>
      <NextCard className="flex-row justify-center p-2 mb-6 w-full" shadow="sm">
        <h2 className="text-xl text-center">
          Posts by users you are following
        </h2>
      </NextCard>
      <div className="">
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
          : null}
      </div>
    </>
  )
}

export default Feed
