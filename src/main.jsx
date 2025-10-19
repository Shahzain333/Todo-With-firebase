import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// Import CreateBrowserRouter  and RouterProvider
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom'

import { ContextProvider } from '../src/components/ContextAPI.jsx'

// Import Pages / Components
import Login from './components/login/Login.jsx'
import Signup from './components/register/Signup.jsx'
import Layout from './Layout.jsx'
import Home from './components/home/Home.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />}>
      <Route index element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <ContextProvider>
      <RouterProvider router={router} />
    </ContextProvider>
  </StrictMode>,
)
