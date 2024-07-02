import { useLazyGetPostByIdQuery } from "../../app/services/postApi"
import {
  Controller,
  UseFormProps,
  UseFormReturn,
  useForm,
} from "react-hook-form"
import { Button, Textarea } from "@nextui-org/react"
import ErrorMessage from "../ui/error-message"
import { IoMdCreate } from "react-icons/io"
import { useParams } from "react-router-dom"
import { useCreateCommentMutation } from "../../app/services/commentApi"
import React from "react"

type Props = {
  form: UseFormReturn
}

const CreateComment: React.FC<Props> = ({ form }) => {
  const { id } = useParams<{ id: string }>()
  const [createComment] = useCreateCommentMutation()
  const [getPostById] = useLazyGetPostByIdQuery()

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = form

  const error = errors?.post?.message as string

  const onSubmit = handleSubmit(async data => {
    try {
      if (id) {
        await createComment({ content: data.comment, postId: id }).unwrap()
        setValue("comment", "")
        await getPostById(id).unwrap()
      }
    } catch (error) {
      console.log(error)
    }
  })

  return (
    <form className="flex-grow" onSubmit={onSubmit}>
      <Controller
        name="comment"
        control={control}
        defaultValue=""
        rules={{ required: "Field required" }}
        render={({ field }) => (
          <Textarea
            {...field}
            labelPlacement="outside"
            placeholder="Leave a comment"
            className="mb-5"
          />
        )}
      />
      {errors && <ErrorMessage error={error} />}
      <Button
        color="primary"
        className="flex-end flex"
        endContent={<IoMdCreate />}
        type="submit"
      >
        Comment
      </Button>
    </form>
  )
}

export default CreateComment
