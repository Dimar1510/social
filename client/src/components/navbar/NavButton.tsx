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
      <Button className="flex justify-start text-xl w-full" icon={icon}>
        {children}
      </Button>
    </Link>
  )
}

export default NavButton