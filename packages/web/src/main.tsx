import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.scss'
import {RouterProvider} from "react-router-dom"
import router from './pages/router'
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <RouterProvider router={router} />
)
