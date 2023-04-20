import { useState } from 'react'
import { Button, Space } from 'antd';
import Home from './pages/home';
import React from 'react';
import Login from './pages/login';
import { CSSTransition,TransitionGroup,SwitchTransition} from "react-transition-group"
import { BrowserRouter as Router, Outlet, Route, useLocation } from 'react-router-dom';
function App() {
  const location = useLocation()
  return (
    <div className='h-screen'>
    <SwitchTransition mode="out-in">
       <CSSTransition key={location.key} timeout={300} classNames="fade" nodeRef={null}>
           <Outlet />
       </CSSTransition>
   </SwitchTransition>
  </div>
  )
}

export default App
