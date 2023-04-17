import { useState } from 'react'
import { Button, Space } from 'antd';
import Home from './pages/home';
import React from 'react';
import Login from './pages/login';
import { BrowserRouter as Router, Route } from 'react-router-dom';
function App() {
  const [count, setCount] = useState(0);

  return (
    <div className='h-screen'>
      <Home></Home>
    </div>
  )
}

export default App
