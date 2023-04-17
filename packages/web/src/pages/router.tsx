import React from "react";
import Home from "./home";
import Login from "./login";
import { createBrowserRouter } from "react-router-dom"
import App from "../App";

const routes = createBrowserRouter( [
  { path: "/", element: <App /> },
  { path: "/login", element: <Login /> }
])
export default routes




