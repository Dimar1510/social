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
    <nav className="flex xs:flex-col justify-between h-[50px] xs:h-screen gap-2">
      <ul className="flex xs:flex-col xs:gap-5 justify-between w-full">
        <li className="hidden xs:block">
          <Link to={"/"}>
            <div className="flex text-3xl px-6 justify-center sm:justify-start items-center">
              <GiBirdTwitter />
            </div>
          </Link>
        </li>
        <li>
          <NavButton href="/" icon={<AiOutlineHome />}>
            <span className="hidden sm:inline">All Posts</span>
          </NavButton>
        </li>
        <li>
          <NavButton href="following" icon={<PiUsers />}>
            <span className="hidden sm:inline">Following</span>
          </NavButton>
        </li>
        <li>
          <NavButton href="followers" icon={<PiUsersThree />}>
            <span className="hidden sm:inline">My followers</span>
          </NavButton>
        </li>
        <li className="px-6 sm:self-center sm:w-full flex justify-center sm:justify-start items-center">
          <Button
            onPress={onOpen}
            color="primary"
            className="flex-end flex sm:w-4/5 p-2 min-w-[40px] "
            type="submit"
          >
            <span className="hidden sm:inline">Add post</span>
            <span className="text-xl sm:hidden">
              <IoCreateOutline />
            </span>
          </Button>
        </li>
      </ul>
      <UserControl />
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
    </nav>
  )
}

export default Sidebar
