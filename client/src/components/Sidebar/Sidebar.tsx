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
import CreatePost from "../createPost"
import { useContext } from "react"
import { ThemeContext } from "../theme-provider"

import UserControl from "./UserControl"
import { PiUsers, PiUsersThree } from "react-icons/pi"
import { IoCreateOutline } from "react-icons/io5"

const Sidebar = () => {
  const current = useSelector(selectCurrent)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { theme } = useContext(ThemeContext)

  if (!current) {
    return null
  }

  return (
    <>
      <nav className="flex xs:flex-col justify-between h-[50px] xs:h-screen gap-8 px-4 items-center">
        <div className="flex xs:flex-col xs:gap-5 justify-between w-full xs:p-0">
          <Link className="hidden xs:block" to={"/"}>
            <div className="flex text-3xl justify-center sm:justify-start items-center">
              <GiBirdTwitter />
            </div>
          </Link>

          <NavButton href="/" icon={<AiOutlineHome />}>
            <span className="hidden sm:inline">All Posts</span>
          </NavButton>

          <NavButton href={`/following/${current.id}`} icon={<PiUsers />}>
            <span className="hidden sm:inline">Following</span>
          </NavButton>

          <NavButton href={`/followers/${current.id}`} icon={<PiUsersThree />}>
            <span className="hidden sm:inline">My followers</span>
          </NavButton>

          <div className="sm:self-start sm:w-4/5 flex justify-center sm:justify-start items-center">
            <Button
              onPress={onOpen}
              color="primary"
              className="hidden sm:flex items-center"
              fullWidth
            >
              <span className="">Add post</span>
              <span className="text-xl">
                <IoCreateOutline />
              </span>
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
