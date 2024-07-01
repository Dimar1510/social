import { useParams } from "react-router-dom"
import { useGetPostByIdQuery } from "../../app/services/postApi"
import Card from "../../components/ui/card"
import Back from "../../components/ui/back/Back"
import CreateComment from "../../components/createComment"

const CurrentPost = () => {
  const params = useParams<{ id: string }>()
  const { data } = useGetPostByIdQuery(params?.id ?? "")

  if (!data) {
    return <h2>No such post</h2>
  }

  const {
    content,
    id,
    authorId,
    author,
    comments,
    likedByUser,
    likes,
    createdAt,
  } = data
  return (
    <>
      <Back />
      <Card
        cardFor="current-post"
        avatarUrl={author.avatarUrl ?? ""}
        content={content}
        name={author.name ?? ""}
        likes={likes}
        commentsCount={comments.length}
        authorId={authorId}
        id={id}
        likedByUser={likedByUser}
        createdAt={createdAt}
      />
      <div className="mt-10">
        {data.comments
          ? data.comments.map(comment => (
              <Card
                key={comment.id}
                cardFor="comment"
                avatarUrl={comment.user.avatarUrl ?? ""}
                content={comment.content}
                name={comment.user.name ?? ""}
                authorId={comment.userId}
                commentId={comment.id}
                id={id}
                likes={likes}
                createdAt={comment.createdAt}
              />
            ))
          : null}
      </div>{" "}
      <div className="mt-10">
        <CreateComment />
      </div>
    </>
  )
}

export default CurrentPost
