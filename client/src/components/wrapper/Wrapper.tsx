import React from "react"

type Props = {
  children: React.ReactElement[] | React.ReactElement
}

const Wrapper = ({ children }: Props) => {
  return <div className="flex max-w-screen-lg mx-auto">{children}</div>
}

export default Wrapper
