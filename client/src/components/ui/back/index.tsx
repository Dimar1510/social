import React from "react"
import { FaRegArrowAltCircleLeft } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

const Back = () => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(-1)
  }
  return (
    <button
      className="text-default-500 flex items-center gap-2 mb-10 cursor-pointer"
      onClick={handleClick}
    >
      <FaRegArrowAltCircleLeft />
      Go back
    </button>
  )
}

export default Back
