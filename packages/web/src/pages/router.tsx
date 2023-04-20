import React, { Children } from "react";
import Home from "./home";
import Login from "./login";
import { createBrowserRouter } from "react-router-dom"
import App from "../App";
import Reigister from "./register";

const routes = createBrowserRouter([
  {
    path: "/", element: <App />, children: [
      { element: <Home />, index: true },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Reigister /> },
    ]
  },
])
export default routes
