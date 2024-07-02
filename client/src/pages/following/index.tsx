import { useSelector } from "react-redux"
import { selectCurrent, selectUser } from "../../features/userSlice"
import { Link, useParams } from "react-router-dom"
import { Card, CardBody, useDisclosure } from "@nextui-org/react"
import User from "../../components/user"
import { useGetUserByIdQuery } from "../../app/services/userApi"

const Following = () => {
  const params = useParams<{ id: string }>()
  const { data } = useGetUserByIdQuery(params?.id ?? "")

  if (!data) {
    return <h2>User not found</h2>
  }

  return data.following.length > 0 ? (
    <div className="gap-5 flex-col">
      {data.following.map(user => (
        <Link to={`/users/${user.following.id}`} key={user.following.id}>
          <Card>
            <CardBody className="block">
              <User
                name={user.following.name ?? ""}
                avatarUrl={user.following.avatarUrl ?? ""}
                description={user.following.email ?? ""}
              />
            </CardBody>
          </Card>
        </Link>
      ))}
    </div>
  ) : (
    <h2>Start following someone</h2>
  )
}

export default Following
