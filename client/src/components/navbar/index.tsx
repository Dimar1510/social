import { BsPostcard } from "react-icons/bs"
import NavButton from "./NavButton"
import { FiUsers } from "react-icons/fi"
import { FaUsers } from "react-icons/fa"

const Navbar = () => {
  return (
    <nav>
      <ul className="flex flex-col gap-5">
        <li>
          <NavButton href="/" icon={<BsPostcard />}>
            Posts
          </NavButton>
        </li>
        <li>
          <NavButton href="following" icon={<FiUsers />}>
            Following
          </NavButton>
        </li>
        <li>
          <NavButton href="followers" icon={<FaUsers />}>
            My followers
          </NavButton>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
