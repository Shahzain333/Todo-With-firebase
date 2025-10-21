import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './pages/header/Header.jsx'
import { useContextAPI } from './ContextAPI.jsx'

function Layout() {
    
    const { theme } = useContextAPI();

  return (
    <div className={theme === 'light' ? 
      'bg-zinc-300 text-zinc-900 min-h-screen' : 
      'bg-zinc-900 text-zinc-300 min-h-screen' }>
        <Header />
        <Outlet />
    </div>
  )
}

export default Layout
