import React, { useContext, useState } from "react"
import { useForm } from "react-hook-form"
import Input from "../components/ui/input"
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react"
import { useLazyCurrentQuery, useLoginMutation } from "../app/services/userApi"
import { useNavigate } from "react-router-dom"
import ErrorMessage from "../components/ui/error-message"
import { hasErrorField } from "../utils/has-error-field"
import { ThemeContext } from "../components/theme-provider"

type Props = {
  isOpen: boolean
  onClose: () => void
}

type Login = {
  email: string
  password: string
}

const Login: React.FC<Props> = ({ isOpen, onClose }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Login>({
    mode: "onChange",
    reValidateMode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const [login, { isLoading }] = useLoginMutation()
  const [triggerCurrentQuery] = useLazyCurrentQuery()
  const [error, setError] = useState("")
  const { theme } = useContext(ThemeContext)
  const navigate = useNavigate()

  const onSubmit = async (data: Login) => {
    try {
      await login(data).unwrap()
      await triggerCurrentQuery().unwrap()
      navigate("/")
    } catch (error) {
      if (hasErrorField(error)) {
        setError(error.data.error)
      }
    }
  }

  const handleCLose = () => {
    setError("")
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCLose}
      className={`${theme} text-foreground pb-4`}
    >
      <ModalContent>
        <>
          <ModalHeader className="flex justify-center text-2xl">
            Sign in
          </ModalHeader>
          <ModalBody>
            <form
              className="flex flex-col gap-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Input
                control={control}
                name="email"
                label="Email"
                type="email"
                required="Field required"
              />
              <Input
                control={control}
                name="password"
                label="Password"
                type="password"
                required="Field required"
              />
              {error !== "" ? <ErrorMessage error={error} /> : ""}

              <div className="flex gap-2 justify-end">
                <Button
                  fullWidth
                  color="primary"
                  type="submit"
                  isLoading={isLoading}
                >
                  Sign in
                </Button>
              </div>
            </form>
          </ModalBody>
        </>
      </ModalContent>
    </Modal>
  )
}

export default Login
