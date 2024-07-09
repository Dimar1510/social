import { useCreatePostMutation } from "../../app/services/postApi"
import { Controller, useForm } from "react-hook-form"
import { Button, Textarea, Tooltip } from "@nextui-org/react"
import ErrorMessage from "../ui/error-message/ErrorMessage"
import { handleFileUpload } from "../../utils/handle-file-upload"
import { useRef, useState } from "react"
import { RiImageAddLine } from "react-icons/ri"

type Data = {
  content: string
}

type Props = {
  onClose?: () => void
}

const CreatePost: React.FC<Props> = ({ onClose }) => {
  const [createPost, status] = useCreatePostMutation()

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<Data>()

  const inputFile = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState("")

  const onSubmit = async (data: Data) => {
    try {
      const formData = new FormData()
      formData.append("content", data.content)
      selectedFile && formData.append("image", selectedFile)
      await createPost({ postData: formData }).unwrap()
      setSelectedFile(null)
      reset()
      if (inputFile.current) inputFile.current.value = ""
      setError("")
      if (onClose) onClose()
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
        <Button
          isLoading={status.isLoading}
          color="primary"
          className=""
          type="submit"
        >
          Add post
        </Button>

        {!status.isLoading && (
          <>
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
              onChange={e => handleFileUpload(e, setError, setSelectedFile)}
            />

            <div className="break-all">{selectedFile && selectedFile.name}</div>
          </>
        )}
      </div>

      {errors && <ErrorMessage error={error} />}
    </form>
  )
}

export default CreatePost
