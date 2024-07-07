import NavButton from "./NavButton"
import { GiBirdTwitter } from "react-icons/gi"
import { useSelector } from "react-redux"
import { selectCurrent } from "../../features/userSlice"
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react"
import { Link } from "react-router-dom"
import { AiOutlineHome } from "react-icons/ai"
import CreatePost from "../createPost/CreatePost"
import { useContext } from "react"
import { ThemeContext } from "../theme-provider"

import UserControl from "./UserControl"
import { PiNewspaperClippingLight, PiUsers, PiUsersThree } from "react-icons/pi"
import { IoCreateOutline } from "react-icons/io5"
import { usePrefetch as usePrefetchUser } from "../../app/services/userApi"
import { usePrefetch as usePrefetchPosts } from "../../app/services/postApi"

const Sidebar = () => {
  const current = useSelector(selectCurrent)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { theme } = useContext(ThemeContext)
  const prefetchUser = usePrefetchUser("getUserById")
  const prefetchPosts = usePrefetchPosts("getAllPosts")
  const prefetchFeed = usePrefetchPosts("getFeedPosts")

  if (!current) {
    return null
  }

  return (
    <>
      <nav className="flex xs:flex-col justify-between h-[50px] xs:h-screen gap-8 px-4 items-center">
        <div className="flex xs:flex-col xs:gap-5 justify-between w-full xs:p-0">
          <Link
            className="hidden xs:block"
            to={"/"}
            onMouseEnter={() => prefetchPosts()}
          >
            <div className="flex text-3xl justify-center sm:justify-start items-center">
              <GiBirdTwitter />
            </div>
          </Link>

          <NavButton
            href="/"
            icon={<AiOutlineHome />}
            onMouseEnter={() => prefetchPosts()}
          >
            <span className="hidden sm:inline">All Posts</span>
          </NavButton>

          <NavButton
            href="/feed"
            icon={<PiNewspaperClippingLight />}
            onMouseEnter={() => prefetchFeed()}
          >
            <span className="hidden sm:inline">My feed</span>
          </NavButton>

          <NavButton
            href={`/following/${current.id}`}
            icon={<PiUsers />}
            onMouseEnter={() => prefetchUser(current.id)}
          >
            <span className="hidden sm:inline">Following</span>
          </NavButton>

          <NavButton
            href={`/followers/${current.id}`}
            icon={<PiUsersThree />}
            onMouseEnter={() => prefetchUser(current.id)}
          >
            <span className="hidden sm:inline">My followers</span>
          </NavButton>

          <div className="sm:self-start sm:w-4/5 flex justify-center sm:justify-start items-center">
            <Button
              onPress={onOpen}
              color="primary"
              className="hidden sm:flex items-center text-lg"
              fullWidth
            >
              <span className="text-xl">
                <IoCreateOutline />
              </span>
              <span className="text-medium">Add post</span>
            </Button>
            <Button
              onPress={onOpen}
              color="primary"
              className="sm:hidden"
              fullWidth
              isIconOnly
            >
              <span className="text-xl">
                <IoCreateOutline />
              </span>
            </Button>
          </div>
        </div>
        <UserControl />
      </nav>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        className={`${theme} text-foreground pb-4`}
        placement="center"
      >
        <ModalContent>
          <>
            <ModalHeader className="flex justify-center text-2xl">
              Create post
            </ModalHeader>
            <ModalBody>
              <CreatePost onClose={onClose} />
            </ModalBody>
          </>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Sidebar
