import React from "react"
import Button from "../ui/button"
import { Link } from "react-router-dom"

type Props = {
  children: React.ReactNode
  icon?: JSX.Element
  href: string
}

const NavButton: React.FC<Props> = ({ children, icon, href }) => {
  return (
    <Link to={href}>
      <Button
        className="flex justify-center sm:justify-start text-2xl sm:text-xl min-w-[20px] pl-6"
        icon={icon}
      >
        {children}
      </Button>
    </Link>
  )
}

export default NavButton
