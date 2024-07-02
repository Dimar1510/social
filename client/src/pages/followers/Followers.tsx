import { useSelector } from "react-redux"
import { selectCurrent } from "../../features/userSlice"
import { Link, useParams } from "react-router-dom"
import { Card, CardBody, Divider } from "@nextui-org/react"
import User from "../../components/user"
import { useGetUserByIdQuery } from "../../app/services/userApi"
import Back from "../../components/ui/back/Back"
import SearchInput from "../../components/ui/searchInput/SearchInput"
import { useState } from "react"

const Followers = () => {
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
      {data.followers.length > 0 ? (
        <div className="flex gap-5 flex-col">
          <SearchInput value={search} onChange={setSearch} />
          <h2 className="text-xl text-center">
            {isCurrentUser ? `Your ` : `${data.name}'s `}
            {`followers (${data.followers.length}):`}
          </h2>
          <div className="z-10 min-h-[40px] flex flex-col justify-center overflow-hidden relative after:text-center after:text-lg empty:after:content-['No_search_results'] after:size-full after:absolute after:left-0 after:top-0 after:-z-10">
            {data.followers?.map(
              user =>
                user.follower.name?.toLowerCase().includes(search) && (
                  <div key={user.follower.id}>
                    <Link to={`/users/${user.follower.id}`}>
                      <User
                        className="my-6"
                        name={user.follower.name ?? ""}
                        avatarUrl={user.follower.avatarUrl ?? ""}
                        description={user.follower.email ?? ""}
                      />
                    </Link>
                    <Divider />
                  </div>
                ),
            )}
          </div>
        </div>
      ) : (
        <h2 className="text-xl text-center">No followers yet</h2>
      )}
    </>
  )
}

export default Followers
