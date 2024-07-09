import React, { useContext, useState } from "react"
import { User } from "../../app/types"
import { ThemeContext } from "../theme-provider"
import { useUpdateUserMutation } from "../../app/services/userApi"
import { useParams } from "react-router-dom"
import { Controller, useForm } from "react-hook-form"
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Textarea,
} from "@nextui-org/react"
import Input from "../ui/input/Input"
import ErrorMessage from "../ui/error-message/ErrorMessage"
import { hasErrorField } from "../../utils/has-error-field"
import { RiImageAddLine } from "react-icons/ri"

type Props = {
  isOpen: boolean
  onClose: () => void
  user?: User | null
  handleUpdate: () => void
}

const EditProfile: React.FC<Props> = ({
  isOpen,
  onClose,
  handleUpdate,
  user,
}) => {
  const { theme } = useContext(ThemeContext)
  const [updateUser, { isLoading }] = useUpdateUserMutation()
  const [error, setError] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { id } = useParams<{ id: string }>()

  const { handleSubmit, control } = useForm<User>({
    mode: "onChange",
    reValidateMode: "onBlur",
    defaultValues: {
      email: user?.email,
      name: user?.name,
      dateOfBirth: user?.dateOfBirth?.substring(0, 10),
      bio: user?.bio || "",
      location: user?.location || "",
    },
  })

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

  const onSubmit = async (data: User) => {
    if (id) {
      try {
        const formData = new FormData()
        data.name && formData.append("name", data.name)
        data.email &&
          data.email !== user?.email &&
          formData.append("email", data.email)
        data.dateOfBirth &&
          formData.append(
            "dateOfBirth",
            new Date(data.dateOfBirth).toISOString(),
          )
        data.bio && formData.append("bio", data.bio)
        data.location && formData.append("location", data.location)
        selectedFile && formData.append("image", selectedFile)
        await updateUser({ userData: formData, id }).unwrap()
        handleUpdate()
      } catch (error) {
        if (hasErrorField(error)) {
          setError(error.data.error)
        }
      }
    }
  }

  const onDeleteAvatar = async (data: User) => {
    if (id) {
      try {
        const formData = new FormData()
        data.dateOfBirth &&
          formData.append(
            "dateOfBirth",
            new Date(data.dateOfBirth).toISOString(),
          )
        data.bio && formData.append("bio", data.bio)
        data.location && formData.append("location", data.location)
        formData.append("deleteAvatar", "true")
        await updateUser({ userData: formData, id }).unwrap()
        handleUpdate()
      } catch (error) {
        if (hasErrorField(error)) {
          setError(error.data.error)
        }
      }
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className={`${theme} text-foreground`}
      placement="center"
    >
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1">
            Edit your profile
          </ModalHeader>
          <ModalBody>
            <form
              className="flex flex-col gap-4 short:gap-1"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="flex flex-col gap-4 short:flex-row">
                <Input
                  control={control}
                  name="email"
                  label="Email"
                  type="email"
                  required="Field required"
                />
                <Input
                  control={control}
                  name="name"
                  label="Name"
                  type="text"
                  required="Field required"
                />
              </div>
              <div className="flex justify-between items-center">
                <label
                  htmlFor={"avatarUrl"}
                  className="cursor-pointer flex items-center gap-2 ml-2  p-2 rounded-xl hover:bg-primary"
                >
                  <RiImageAddLine />
                  Upload avatar
                </label>

                <input
                  type="file"
                  name="avatarUrl"
                  id="avatarUrl"
                  className="hidden"
                  required={false}
                  onChange={handleFileUpload}
                />
                {user?.avatarUrl && (
                  <Button onClick={handleSubmit(onDeleteAvatar)}>
                    Delete avatar
                  </Button>
                )}
              </div>
              <div className="break-all ml-4">
                {selectedFile && selectedFile.name}
              </div>

              <Input
                control={control}
                name="dateOfBirth"
                label="Birthday"
                type="date"
              />
              <Controller
                name="bio"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    rows={4}
                    placeholder="Tell something about yourself"
                    defaultValue=""
                  />
                )}
              />
              <Input
                control={control}
                name="location"
                label="Location"
                type="text"
              />
              <ErrorMessage error={error} />
              <div className="flex gap-2 justify-end">
                <Button
                  fullWidth
                  color="primary"
                  type="submit"
                  isLoading={isLoading}
                >
                  Update profile
                </Button>
              </div>
            </form>
          </ModalBody>
        </>
      </ModalContent>
    </Modal>
  )
}

export default EditProfile
