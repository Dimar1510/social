import { useParams } from "react-router-dom"
import {
  useGetUserByIdQuery,
  useLazyCurrentQuery,
  useLazyGetUserByIdQuery,
} from "../../app/services/userApi"
import { Button, Card, Image, useDisclosure } from "@nextui-org/react"
import { useDispatch, useSelector } from "react-redux"
import { resetUser, selectCurrent } from "../../features/userSlice"
import {
  useFollowUserMutation,
  useUnfollowUserMutation,
} from "../../app/services/followApi"
import { useEffect } from "react"
import Back from "../../components/ui/back"
import { BASE_URL } from "../../constants"
import {
  MdOutlinePersonAddAlt1,
  MdOutlinePersonAddDisabled,
} from "react-icons/md"
import { CiEdit } from "react-icons/ci"
import ProfileInfo from "../../components/profile-info"
import { formatToClientDate } from "../../utils/format-to-client-date"
import CountInfo from "../../components/count-info"
import EditProfile from "../../components/edit-profile"
import { formatToClientDay } from "../../utils/format-to-client-day"

const UserProfile = () => {
  const params = useParams<{ id: string }>()
  const { data } = useGetUserByIdQuery(params?.id ?? "")
  const { isOpen, onOpen, onClose } = useDisclosure()
  const currentUser = useSelector(selectCurrent)
  const [followUser] = useFollowUserMutation()
  const [unfollowUser] = useUnfollowUserMutation()
  const [triggerGetUserByIdQuery] = useLazyGetUserByIdQuery()
  const [triggerCurrentQuery] = useLazyCurrentQuery()

  const dispatch = useDispatch()

  useEffect(
    () => () => {
      dispatch(resetUser())
    },
    [],
  )

  if (!data) {
    return <h2>User not found</h2>
  }

  const handleFollow = async () => {
    try {
      if (params?.id) {
        data.isFollowing
          ? await unfollowUser(params?.id).unwrap()
          : await followUser({ followingId: params?.id }).unwrap()
        await triggerGetUserByIdQuery(params?.id)
        await triggerCurrentQuery()
      }
    } catch (error) {}
  }

  const handleClose = async () => {
    try {
      if (params?.id) {
        await triggerGetUserByIdQuery(params?.id)
        await triggerCurrentQuery()
        onClose()
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <Back />
      <div className="flex gap-4">
        <Card className="flex flex-col items-center text-center space-y-4 p-5 flex-2">
          <Image
            src={`${BASE_URL}${data.avatarUrl}`}
            alt={data.name}
            width={200}
            height={200}
            className="border-4 border-white"
          />
          <div className="flex flex-col text-2xl font-bold gap-4 items-center">
            {data.name}
            {currentUser?.id !== params?.id ? (
              <Button
                color={data.isFollowing ? "default" : "primary"}
                variant="flat"
                className="gap-2"
                onClick={handleFollow}
                endContent={
                  data.isFollowing ? (
                    <MdOutlinePersonAddDisabled />
                  ) : (
                    <MdOutlinePersonAddAlt1 />
                  )
                }
              >
                {data.isFollowing ? "Unfollow" : "Follow"}
              </Button>
            ) : (
              // DIALOG
              <Button onClick={() => onOpen()} endContent={<CiEdit />}>
                Edit profile
              </Button>
            )}
          </div>
        </Card>
        <Card className="flex flex-col space-y-4 p-5 flex-1">
          <ProfileInfo title="Email" info={data.email} />
          <ProfileInfo title="Location" info={data.location} />
          <ProfileInfo
            title="Birthday"
            info={formatToClientDay(data.dateOfBirth)}
          />
          <ProfileInfo title="About me" info={data.bio} />
          <div className="flex gap-2">
            <CountInfo count={data.followers.length} title="Followers" />
            <CountInfo count={data.following.length} title="Following" />
          </div>
        </Card>
      </div>
      <EditProfile isOpen={isOpen} onClose={handleClose} user={data} />
    </>
  )
}

export default UserProfile
