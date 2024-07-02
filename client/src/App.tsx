import React from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import { store } from "./app/store"
import "./index.css"
import { NextUIProvider } from "@nextui-org/react"
import {
  Route,
  RouterProvider,
  Routes,
  createBrowserRouter,
  useNavigate,
} from "react-router-dom"
import ThemeProvider from "./components/theme-provider"
import Auth from "./pages/auth/Auth"
import Layout from "./components/layout/Layout"
import Posts from "./pages/posts"
import CurrentPost from "./pages/current-post"
import UserProfile from "./pages/user-profile/UserProfile"
import Followers from "./pages/followers/Followers"
import Following from "./pages/following/Following"
import AuthGuard from "./features/AuthGuard"

const router = createBrowserRouter([
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Posts />,
      },
      {
        path: "posts/:id",
        element: <CurrentPost />,
      },
      {
        path: "users/:id",
        element: <UserProfile />,
      },
      {
        path: "followers/:id",
        element: <Followers />,
      },
      {
        path: "following/:id",
        element: <Following />,
      },
    ],
  },
])

const App = () => {
  const navigate = useNavigate()
  return (
    <NextUIProvider navigate={navigate}>
      <ThemeProvider>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Layout />}>
            <Route path="" element={<Posts />} />
            <Route path="posts/:id" element={<CurrentPost />} />
            <Route path="users/:id" element={<UserProfile />} />
            <Route path="followers/:id" element={<Followers />} />
            <Route path="following/:id" element={<Following />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </NextUIProvider>
  )
}

export default App
