import React from "react"

type Props = {
  children: React.ReactElement[] | React.ReactElement
}

const Wrapper = ({ children }: Props) => {
  return <div className="flex max-w-screen-xl mx-auto mt-10">{children}</div>
}

export default Wrapper
