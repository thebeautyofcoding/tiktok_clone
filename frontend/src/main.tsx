import React from "react"
import ReactDOM from "react-dom/client"

import App from "./App.tsx"
import "./index.css"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import Feed from "./pages/Feed.tsx"
import Upload from "./pages/Upload.tsx"
import Profile from "./pages/Profile.tsx"
import SinglePost from "./pages/SinglePost.tsx"
import { ApolloProvider } from "@apollo/client"
import { client } from "./utils/apolloClient"
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev"
import ProtectedRoutes from "./components/ProtectedRoutes.ts"

loadDevMessages()
loadErrorMessages()

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoutes>
        <Feed />
      </ProtectedRoutes>
    ),
  },
  {
    path: "/upload",
    element: (
      <ProtectedRoutes>
        <Upload />
      </ProtectedRoutes>
    ),
  },

  //profile page with dynamic id parameter
  {
    path: "/profile/:id",
    element: <Profile />,
  },
  {
    path: "/post/:id",
    element: <SinglePost />,
  },
])

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <RouterProvider router={router} />

      <App />
    </ApolloProvider>
  </React.StrictMode>
)
