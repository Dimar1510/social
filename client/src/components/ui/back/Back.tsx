import { IoArrowBackOutline } from "react-icons/io5"
import { useNavigate } from "react-router-dom"

const Back = () => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(-1)
  }
  return (
    <button
      className="text-default-500 flex items-center gap-2 cursor-pointer p-4"
      onClick={handleClick}
    >
      <IoArrowBackOutline />
    </button>
  )
}

export default Back
