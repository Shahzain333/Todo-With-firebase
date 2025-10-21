import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// Import CreateBrowserRouter  and RouterProvider
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route, useNavigate } from 'react-router-dom'

import { ContextProvider } from '../src/ContextAPI.jsx'
import { useContextAPI } from '../src/ContextAPI.jsx'

// Import Pages / Components
import Login from './pages/login/Login.jsx'
import Signup from './pages/register/Signup.jsx'
import Layout from './Layout.jsx'
import Home from './pages/home/Home.jsx'
import Todos from './pages/todos/Todos.jsx'

//const { isLoggedIn } = useContextAPI();
// const navigate = useNavigate();

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />}>
      <Route index element={<Home />} />
      <Route path='/todos' element={<Todos />} />
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
