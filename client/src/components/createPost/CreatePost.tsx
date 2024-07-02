import {
  useCreatePostMutation,
  useLazyGetAllPostsQuery,
} from "../../app/services/postApi"
import { Controller, useForm } from "react-hook-form"
import { Button, Textarea } from "@nextui-org/react"
import ErrorMessage from "../ui/error-message"

import { useLazyGetUserByIdQuery } from "../../app/services/userApi"
import { useSelector } from "react-redux"
import { selectCurrent } from "../../features/userSlice"

type Props = {
  onClose?: () => void
}

const CreatePost: React.FC<Props> = ({ onClose }) => {
  const [createPost] = useCreatePostMutation()
  const [triggerGetAllPosts] = useLazyGetAllPostsQuery()
  const [triggerGetUserByIdQuery] = useLazyGetUserByIdQuery()
  const currentUser = useSelector(selectCurrent)
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm()

  const error = errors?.post?.message as string

  const userId = currentUser === null ? "" : currentUser.id

  const onSubmit = handleSubmit(async data => {
    try {
      await createPost({ content: data.post }).unwrap()
      setValue("post", "")
      await triggerGetAllPosts().unwrap()
      await triggerGetUserByIdQuery(userId)
      if (onClose) onClose()
    } catch (error) {
      console.log(error)
    }
  })

  return (
    <form className="flex-grow" onSubmit={onSubmit}>
      <Controller
        name="post"
        control={control}
        defaultValue=""
        rules={{ required: "Field required" }}
        render={({ field }) => (
          <Textarea
            {...field}
            labelPlacement="outside"
            placeholder="What are your thoughts?"
            className="mb-5"
            maxLength={140}
          />
        )}
      />
      {errors && <ErrorMessage error={error} />}
      <Button color="primary" className="flex-end flex" type="submit">
        Add post
      </Button>
    </form>
  )
}

export default CreatePost
