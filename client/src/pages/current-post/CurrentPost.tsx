import { useParams } from "react-router-dom"
import { useGetPostByIdQuery } from "../../app/services/postApi"
import Card from "../../components/ui/card/PostCard"
import Back from "../../components/ui/back/Back"
import CreateComment from "../../components/createComment"
import { useState } from "react"
import { useForm } from "react-hook-form"

const CurrentPost = () => {
  const params = useParams<{ id: string }>()
  const { data } = useGetPostByIdQuery(params?.id ?? "")
  const form = useForm()

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
                handleReply={handleReply}
              />
            ))
          : null}
      </div>{" "}
      <div className="mt-10">
        <CreateComment form={form} />
      </div>
    </>
  )
}

export default CurrentPost