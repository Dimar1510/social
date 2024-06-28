import { useContext } from "react"
import { ThemeContext } from "../theme-provider"
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react"
import { FaRegMoon } from "react-icons/fa"
import { LuSunMedium } from "react-icons/lu"

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext)
  return (
    <div>
      <Navbar>
        <NavbarBrand>
          <p className="font-bold text-inherit">Twitter 1/2</p>
        </NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem className="lg:flex text-3xl cursor-pointer">
            <button onClick={toggleTheme}>
              {theme === "light" ? <FaRegMoon /> : <LuSunMedium />}
            </button>
          </NavbarItem>
          <NavbarItem>{/* login condition */}</NavbarItem>
        </NavbarContent>
      </Navbar>
    </div>
  )
}

export default Header
