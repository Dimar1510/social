import { Button } from "@nextui-org/react"
import React from "react"

import { Link } from "@nextui-org/react"

type Props = {
  children: React.ReactNode
  icon?: JSX.Element
  href: string
}

const NavButton: React.FC<Props> = ({ children, icon, href }) => {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 justify-center sm:justify-start text-2xl sm:text-xl min-w-[20px] text-default-800"
    >
      {icon}
      {children}
    </Link>
  )
}

export default NavButton
