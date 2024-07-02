import { useSelector } from "react-redux"
import { selectCurrent } from "../../features/userSlice"
import { Link, useParams } from "react-router-dom"
import { Card, CardBody } from "@nextui-org/react"
import User from "../../components/user"
import { useGetUserByIdQuery } from "../../app/services/userApi"
import Back from "../../components/ui/back/Back"
import SearchInput from "../../components/ui/searchInput/SearchInput"
import { useState } from "react"

const Following = () => {
  const params = useParams<{ id: string }>()
  const { data } = useGetUserByIdQuery(params?.id ?? "")
  const currentUser = useSelector(selectCurrent)
  const [search, setSearch] = useState("")
  if (!data) {
    return <h2>User not found</h2>
  }

  const isCurrentUser = params.id === currentUser?.id

  return (
    <>
      <Card className="flex-row p-2 mb-6" shadow="sm">
        <Back />
        <User
          name={data.name}
          description={data.email}
          avatarUrl={data.avatarUrl}
          className="font-bold max-w-[300px] text-ellipsis break-words"
        />
      </Card>
      {data.following.length > 0 ? (
        <div className="flex gap-5 flex-col">
          <SearchInput value={search} onChange={setSearch} />
          <h2 className="text-xl text-center">
            {isCurrentUser ? `You are ` : `${data.name} is `}
            {`following (${data.followers.length}):`}
          </h2>
          <div className="min-h-[40px] flex gap-4 flex-wrap justify-center overflow-hidden relative after:text-center after:text-lg empty:after:content-['No_search_results'] after:size-full after:absolute after:left-0 after:top-0 ">
            {data.following?.map(
              user =>
                user.following.name?.toLowerCase().includes(search) && (
                  <Link
                    to={`/users/${user.following.id}`}
                    key={user.following.id}
                  >
                    <Card shadow="sm">
                      <CardBody className="block">
                        <User
                          name={user.following.name ?? ""}
                          avatarUrl={user.following.avatarUrl ?? ""}
                          description={user.following.email ?? ""}
                        />
                      </CardBody>
                    </Card>
                  </Link>
                ),
            )}
          </div>
        </div>
      ) : (
        <h2 className="text-xl text-center">No following yet</h2>
      )}
    </>
  )
}
export default Following
