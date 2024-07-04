import { useSelector } from "react-redux"
import { selectCurrent } from "../../features/userSlice"
import { Link, useParams } from "react-router-dom"
import { Card, CardBody, Divider, Spinner } from "@nextui-org/react"
import User from "../../components/user/User"
import { useGetUserByIdQuery } from "../../app/services/userApi"
import Back from "../../components/ui/back/Back"
import SearchInput from "../../components/ui/searchInput/SearchInput"
import { useState } from "react"

const Followers = () => {
  const params = useParams<{ id: string }>()
  const { data, isLoading } = useGetUserByIdQuery(params?.id ?? "")
  const currentUser = useSelector(selectCurrent)
  const [search, setSearch] = useState("")

  if (!isLoading && !data) {
    return <h2>User not found</h2>
  }

  const isCurrentUser = params.id === currentUser?.id

  return (
    <>
      <Card className="flex-row p-2 mb-6" shadow="sm">
        <Back />
        <User
          name={currentUser?.name}
          description={currentUser?.email}
          avatarUrl={currentUser?.avatarUrl}
          className="font-bold max-w-[300px] text-ellipsis break-words"
        />
      </Card>

      <div className="flex gap-5 flex-col xs:mb-0">
        <SearchInput value={search} onChange={setSearch} />
        {isLoading ? (
          <div className="mt-[30%] flex justify-center">
            <Spinner className="scale-[2]" />
          </div>
        ) : (
          data &&
          data.followers.length > 0 && (
            <>
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
            </>
          )
        )}
      </div>

      {data && data.followers.length === 0 && (
        <h2 className="text-xl text-center">No followers yet</h2>
      )}
    </>
  )
}

export default Followers
