import { useLazyGetPostByIdQuery } from "../../app/services/postApi"
import { Controller, UseFormReturn } from "react-hook-form"
import { Button, Textarea, Tooltip } from "@nextui-org/react"
import ErrorMessage from "../ui/error-message"

import { useParams } from "react-router-dom"
import { useCreateCommentMutation } from "../../app/services/commentApi"
import React, { useRef, useState } from "react"
import { RiImageAddLine } from "react-icons/ri"

type Props = {
  form: UseFormReturn
}

const CreateComment: React.FC<Props> = ({ form }) => {
  const { id } = useParams<{ id: string }>()
  const [createComment] = useCreateCommentMutation()
  const [getPostById] = useLazyGetPostByIdQuery()
  const [error, setError] = useState("")
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = form
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const inputFile = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null) {
      const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i

      if (e.target.files[0].size > 5 * 1048576) {
        setError("Maximum file size is 5Mb")
        e.target.value = ""
      } else if (!allowedExtensions.exec(e.target.value)) {
        setError("Invalid file type")
        e.target.value = ""
      } else {
        setError("")
        setSelectedFile(e.target.files[0])
      }
    }
  }

  const onSubmit = handleSubmit(async data => {
    try {
      if (id) {
        const formData = new FormData()
        formData.append("content", data.comment)
        formData.append("postId", id)
        selectedFile && formData.append("image", selectedFile)
        await createComment({ commentData: formData }).unwrap()
        await getPostById(id).unwrap()
        setSelectedFile(null)
        reset()
        if (inputFile.current) inputFile.current.value = ""
        setError("")
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
      <div className="flex gap-4 items-center flex-wrap">
        <Button color="primary" className="" type="submit">
          Add comment
        </Button>
        <Tooltip
          closeDelay={50}
          classNames={{ content: ["bg-default-600/80 text-default-100"] }}
          placement="bottom-start"
          content={`Attach image`}
        >
          <label
            htmlFor={"postimg"}
            className="cursor-pointer text-2xl hover:text-primary"
          >
            <RiImageAddLine />
          </label>
        </Tooltip>
        <input
          type="file"
          name="postimg"
          id="postimg"
          className="hidden"
          ref={inputFile}
          required={false}
          onChange={handleFileUpload}
        />
        <div className="break-all">{selectedFile && selectedFile.name}</div>
      </div>
      {errors && <ErrorMessage error={error} />}
    </form>
  )
}

export default CreateComment
