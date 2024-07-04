import { useParams } from "react-router-dom"
import { useGetPostByIdQuery } from "../../app/services/postApi"
import Card from "../../components/ui/card/PostCard"
import Back from "../../components/ui/back/Back"
import CreateComment from "../../components/createComment/CreateComment"
import { useForm } from "react-hook-form"
import { Spinner } from "@nextui-org/react"

export type Data = {
  content: string
  postimg: File
  postId: string
}

const CurrentPost = () => {
  const params = useParams<{ id: string }>()
  const { data, isLoading } = useGetPostByIdQuery(params?.id ?? "")
  const form = useForm()

  if (!data) {
    return (
      <div className="mt-[50%] flex justify-center">
        <Spinner className="scale-[2]" />
      </div>
    )
  }

  if (!data && !isLoading) {
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
    imageUrl,
  } = data

  const handleReply = (name: string) => {
    form.setValue("comment", form.getValues("comment") + `@${name}, `)
    form.setFocus("comment")
  }

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
        handleReply={handleReply}
        imageUrl={imageUrl}
      />
      <div className="mt-10 ">
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
                handleReply={handleReply}
                imageUrl={comment.imageUrl}
              />
            ))
          : null}
      </div>
      <div className="mt-10 mb-20 xs:mb-0">
        <CreateComment form={form} />
      </div>
    </>
  )
}

export default CurrentPost
