import React, { useState } from "react"
import Input from "../components/ui/input"
import { useForm } from "react-hook-form"
import { Button, Link } from "@nextui-org/react"
import { useRegisterMutation } from "../app/services/userApi"
import { hasErrorField } from "../utils/has-error-field"
import ErrorMessage from "../components/ui/error-message"

type Props = {
  setSelected: (value: string) => void
}

type Register = {
  email: string
  name: string
  password: string
}

const Register: React.FC<Props> = ({ setSelected }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Register>({
    mode: "onChange",
    reValidateMode: "onBlur",
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
  })

  const [register, { isLoading }] = useRegisterMutation()
  const [error, setError] = useState("")

  const onSubmit = async (data: Register) => {
    try {
      await register(data).unwrap()
      setSelected("login")
    } catch (error) {
      if (hasErrorField(error)) {
        setError(error.data.error)
      }
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
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
      <ErrorMessage error={error} />
      <p className="text-center text-small flex gap-1 justify-center">
        Already have an account?
        <Link
          size="sm"
          className="cursor-pointer"
          onPress={() => setSelected("login")}
        >
          Sign up
        </Link>
      </p>
      <div className="flex gap-2 justify-end">
        <Button fullWidth color="primary" type="submit" isLoading={isLoading}>
          Sign in
        </Button>
      </div>
    </form>
  )
}

export default Register
