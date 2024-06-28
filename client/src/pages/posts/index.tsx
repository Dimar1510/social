import { useGetAllPostsQuery } from "../../app/services/postApi"
import CreatePost from "../../components/createPost"
import Card from "../../components/ui/card"

const Posts = () => {
  const { data } = useGetAllPostsQuery()
  return (
    <>
      <div className="mb-10 w-full">
        <CreatePost />
      </div>
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
                cardFor="post"
              />
            ),
          )
        : null}
    </>
  )
}

export default Posts
