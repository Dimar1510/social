import { Link } from "react-router-dom"

const ErrorPage = () => {
  return (
    <div className="h-svh flex flex-col gap-10 justify-center items-center">
      <h1 className="text-7xl">404</h1>
      <Link className="text-xl" to={"/"}>
        Click to go to the Homepage
      </Link>
    </div>
  )
}

export default ErrorPage
