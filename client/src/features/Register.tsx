import React, { useContext, useState } from "react"
import Input from "../components/ui/input"
import { useForm } from "react-hook-form"
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react"
import {
  useLazyCurrentQuery,
  useLoginMutation,
  useRegisterMutation,
} from "../app/services/userApi"
import { hasErrorField } from "../utils/has-error-field"
import ErrorMessage from "../components/ui/error-message"
import { ThemeContext } from "../components/theme-provider"
import { useNavigate } from "react-router-dom"

type Props = {
  isOpen: boolean
  onClose: () => void
}

type Register = {
  email: string
  name: string
  password: string
  password_repeat: string
}

const Register: React.FC<Props> = ({ isOpen, onClose }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    getValues,
  } = useForm<Register>({
    mode: "onChange",
    reValidateMode: "onBlur",
    defaultValues: {
      email: "",
      name: "",
      password: "",
      password_repeat: "",
    },
  })

  const [login, loginLoad] = useLoginMutation()
  const navigate = useNavigate()
  const [register, registerLoad] = useRegisterMutation()
  const [triggerCurrentQuery] = useLazyCurrentQuery()
  const [error, setError] = useState("")
  const { theme } = useContext(ThemeContext)

  const onSubmit = async (data: Register) => {
    if (getValues("password") !== getValues("password_repeat")) {
      setError("Passwords do not match")
      return
    }
    try {
      await register(data).unwrap()
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
            Create an account
          </ModalHeader>
          <ModalBody>
            <form
              className="flex flex-col gap-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Input
                control={control}
                name="name"
                label="Name"
                type="text"
                required="Field required"
              />
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
              <Input
                control={control}
                name="password_repeat"
                label="Confirm password"
                type="password"
              />

              <ErrorMessage error={error} />
              <div className="flex gap-2 justify-end">
                <Button
                  fullWidth
                  color="primary"
                  type="submit"
                  isLoading={loginLoad.isLoading || registerLoad.isLoading}
                >
                  Sign up
                </Button>
              </div>
            </form>
          </ModalBody>
        </>
      </ModalContent>
    </Modal>
  )
}

export default Register
