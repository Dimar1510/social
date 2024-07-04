import { useCurrentQuery } from "../app/services/userApi"

import Loading from "../pages/loading/Loading"

const AuthGuard = ({ children }: { children: JSX.Element }) => {
  const { isLoading } = useCurrentQuery()

  if (isLoading) {
    return <Loading />
  }
  return children
}

export default AuthGuard
