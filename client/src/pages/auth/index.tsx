import { Card, CardBody, Tab, Tabs } from "@nextui-org/react"
import { useEffect, useState } from "react"
import Login from "../../features/Login"
import Register from "../../features/Register"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { selectIsAuthenticated } from "../../features/userSlice"

const Auth = () => {
  const [selected, setSelected] = useState("login")

  const isAuthenticated = useSelector(selectIsAuthenticated)
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/")
    }
  }, [])

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col">
        <Card className="max-w-full w-[340px] h-[400px]">
          <CardBody className="overflow-hidden">
            <Tabs
              fullWidth
              size="md"
              selectedKey={selected}
              onSelectionChange={key => setSelected(key as string)}
            >
              <Tab key="login" title="Sign in">
                <Login setSelected={setSelected} />
              </Tab>
              <Tab key="register" title="Sign up">
                <Register setSelected={setSelected} />
              </Tab>
            </Tabs>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default Auth
