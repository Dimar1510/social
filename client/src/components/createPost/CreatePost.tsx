import {
  useCreatePostMutation,
  useLazyGetAllPostsQuery,
} from "../../app/services/postApi"
import { Controller, useForm } from "react-hook-form"
import { Button, Textarea, Tooltip } from "@nextui-org/react"
import ErrorMessage from "../ui/error-message"

import { useRef, useState } from "react"
import { RiImageAddLine } from "react-icons/ri"

type Data = {
  content: string
  postimg: FileList
}

const CreatePost = () => {
  const [createPost] = useCreatePostMutation()
  const [triggerGetAllPosts] = useLazyGetAllPostsQuery()

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<Data>({})

  const inputFile = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState("")

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

  const onSubmit = async (data: Data) => {
    try {
      console.log(data)
      const formData = new FormData()
      formData.append("content", data.content)
      selectedFile && formData.append("postimg", selectedFile)
      await createPost({ postData: formData }).unwrap()
      await triggerGetAllPosts().unwrap()
      setSelectedFile(null)
      reset()
      if (inputFile.current) inputFile.current.value = ""
      setError("")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <form
      className="flex-grow flex flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Controller
        name="content"
        control={control}
        defaultValue=""
        rules={{ required: "Field required" }}
        render={({ field }) => (
          <Textarea
            {...field}
            labelPlacement="outside"
            placeholder="What are your thoughts?"
            maxLength={140}
          />
        )}
      />
      <div className="flex gap-4 items-center flex-wrap">
        <Button color="primary" className="" type="submit">
          Add post
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

export default CreatePost
