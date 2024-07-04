import { Spinner } from "@nextui-org/react"
import { useGetAllPostsQuery } from "../../app/services/postApi"
import CreatePost from "../../components/createPost/CreatePost"
import Card from "../../components/ui/card/PostCard"

const Posts = () => {
  const { data, isLoading } = useGetAllPostsQuery()

  return (
    <>
      <div className="mb-10 w-full">
        <CreatePost />
      </div>
      {isLoading ? (
        <div className="mt-[30%] flex justify-center">
          <Spinner className="scale-[2]" />
        </div>
      ) : (
        <>
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
        </>
      )}
    </>
  )
}

export default Posts
