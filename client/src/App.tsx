import "./index.css"
import { NextUIProvider } from "@nextui-org/react"
import { Route, Routes, useNavigate } from "react-router-dom"
import ThemeProvider from "./components/theme-provider"
import Auth from "./pages/auth/Auth"
import Layout from "./components/layout/Layout"
import Posts from "./pages/posts/Posts"
import CurrentPost from "./pages/current-post/CurrentPost"
import UserProfile from "./pages/user-profile/UserProfile"
import Followers from "./pages/followers/Followers"
import Following from "./pages/following/Following"
import Feed from "./pages/feed/Feed"
import ErrorPage from "./pages/404/ErrorPage"

const App = () => {
  const navigate = useNavigate()
  return (
    <NextUIProvider navigate={navigate}>
      <ThemeProvider>
        <Routes>
          <Route path="*" element={<ErrorPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Layout />}>
            <Route path="" element={<Posts />} />
            <Route path="posts/:id" element={<CurrentPost />} />
            <Route path="users/:id" element={<UserProfile />} />
            <Route path="followers/:id" element={<Followers />} />
            <Route path="following/:id" element={<Following />} />
            <Route path="feed" element={<Feed />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </NextUIProvider>
  )
}

export default App
