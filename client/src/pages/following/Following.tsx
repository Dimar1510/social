import { useSelector } from "react-redux"
import { selectCurrent } from "../../features/userSlice"
import { Link, useParams } from "react-router-dom"
import { Button, Card, CardBody, Divider, Spinner } from "@nextui-org/react"
import User from "../../components/user/User"
import {
  useGetUserByIdQuery,
  useLazyGetUserByIdQuery,
} from "../../app/services/userApi"
import Back from "../../components/ui/back/Back"
import SearchInput from "../../components/ui/searchInput/SearchInput"
import { useState } from "react"
import {
  MdOutlinePersonAddAlt1,
  MdOutlinePersonAddDisabled,
} from "react-icons/md"
import {
  useFollowUserMutation,
  useUnfollowUserMutation,
} from "../../app/services/followApi"

const Following = () => {
  const params = useParams<{ id: string }>()
  const { data, isLoading } = useGetUserByIdQuery(params?.id ?? "")
  const currentUser = useSelector(selectCurrent)
  const [search, setSearch] = useState("")
  const [unfollowUser] = useUnfollowUserMutation()
  const [triggerGetUserByIdQuery] = useLazyGetUserByIdQuery()
  const [loading, setLoading] = useState(false)

  if (!isLoading && !data) {
    return <h2>User not found</h2>
  }

  const handleFollow = async (userId: string, id: string) => {
    setLoading(true)
    try {
      if (userId) {
        await unfollowUser(userId).unwrap()
        await triggerGetUserByIdQuery(id)
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
    }
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

      <div className="flex gap-5 flex-col mb-20 xs:mb-0">
        <SearchInput value={search} onChange={setSearch} />
        {isLoading ? (
          <div className="mt-[30%] flex justify-center">
            <Spinner className="scale-[2]" />
          </div>
        ) : (
          data &&
          data.following.length > 0 && (
            <>
              <h2 className="text-xl text-center">
                {isCurrentUser ? `You are ` : `${data.name} is `}
                {`following (${data.following.length}):`}
              </h2>
              <div className="z-10 min-h-[40px] flex flex-col justify-center overflow-hidden relative after:text-center after:text-lg empty:after:content-['No_search_results'] after:size-full after:absolute after:left-0 after:top-0 after:-z-10">
                {data.following?.map(
                  user =>
                    user.following.name?.toLowerCase().includes(search) && (
                      <div key={user.following.id}>
                        <div className="flex justify-between w-full items-center">
                          <Link to={`/users/${user.following.id}`}>
                            <User
                              className="my-6"
                              name={user.following.name ?? ""}
                              avatarUrl={user.following.avatarUrl ?? ""}
                              description={user.following.email ?? ""}
                            />
                          </Link>
                          {isCurrentUser && (
                            <Button
                              isLoading={loading}
                              variant="flat"
                              className="items-center hover:bg-danger-200"
                              onClick={() =>
                                handleFollow(user.followingId, data.id)
                              }
                              endContent={<MdOutlinePersonAddDisabled />}
                            >
                              Unfollow
                            </Button>
                          )}
                        </div>
                        <Divider />
                      </div>
                    ),
                )}
              </div>
            </>
          )
        )}

        {data && data.following.length === 0 && (
          <h2 className="text-xl text-center">No following yet</h2>
        )}
      </div>
    </>
  )
}
export default Following
