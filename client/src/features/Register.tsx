import React, { useContext, useState } from "react"
import Input from "../components/ui/input/Input"
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
import ErrorMessage from "../components/ui/error-message/ErrorMessage"
import { ThemeContext } from "../components/theme-provider"
import { useNavigate } from "react-router-dom"

type Props = {
  isOpen: boolean
  onClose: () => void
}

type TRegister = {
  email: string
  name: string
  password: string
  password_repeat: string
}

const Register: React.FC<Props> = ({ isOpen, onClose }) => {
  const { handleSubmit, control, getValues } = useForm<TRegister>({
    mode: "onChange",
    reValidateMode: "onBlur",
    defaultValues: {
      email: "",
      name: "",
      password: "",
      password_repeat: "",
    },
  })

  const [login] = useLoginMutation()
  const navigate = useNavigate()
  const [register] = useRegisterMutation()
  const [triggerCurrentQuery] = useLazyCurrentQuery()
  const [error, setError] = useState("")
  const { theme } = useContext(ThemeContext)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: TRegister) => {
    if (getValues("password") !== getValues("password_repeat")) {
      setError("Passwords do not match")
      return
    }
    setLoading(true)
    try {
      await register(data).unwrap()
      await login(data).unwrap()
      await triggerCurrentQuery().unwrap()
      setLoading(false)
      navigate("/")
    } catch (error) {
      if (hasErrorField(error)) {
        setError(error.data.error)
      }
      setLoading(false)
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
      placement="center"
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
                  isLoading={loading}
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
