import React from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import { store } from "./app/store"
import "./index.css"
import { NextUIProvider } from "@nextui-org/react"
import {
  BrowserRouter,
  RouterProvider,
  createBrowserRouter,
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
import App from "./App"

const container = document.getElementById("root")

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

if (container) {
  const root = createRoot(container)

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <AuthGuard>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthGuard>
      </Provider>
    </React.StrictMode>,
  )
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  )
}
