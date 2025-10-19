import React from 'react'
import { NavLink } from 'react-router-dom'
import Login from '../login/Login'

function Signup() {
  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm bg-zinc-900 dark:bg-zinc-800 
        p-4 sm:p-8 rounded-2xl shadow-lg">
            
            <form action="#" method="POST" className="space-y-6">
                
                <div>
                    <label htmlFor="email" className="block text-lg font-medium text-gray-100">Email</label>
                    <div className="mt-2">
                        <input 
                            id="email" 
                            type="email" 
                            name="email" 
                            required 
                            autoComplete="email" 
                            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base 
                            text-white outline-1 -outline-offset-1 outline-white/10 
                            placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 
                            focus:outline-zinc-500 sm:text-sm/6"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="password" className="block text-lg font-medium text-gray-100">Password</label>
                    <div className="mt-2">
                        <input 
                            id="password" 
                            type="password" 
                            name="password" 
                            required 
                            autoComplete="current-password" 
                            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base 
                            text-white outline-1 -outline-offset-1 outline-white/10 
                            placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 
                            focus:outline-zinc-500 sm:text-sm/6" 
                        />
                    </div>

                </div>

                <div>
                    <button 
                        type="submit" 
                        className="flex w-full justify-center rounded-md bg-zinc-700 px-3 py-1.5 
                        text-sm/6 font-semibold text-white hover:bg-zinc-600 
                        focus-visible:outline-2 focus-visible:outline-offset-2 
                        focus-visible:outline-zinc-500">
                            Sign up
                    </button>
                </div>

            </form>

            <p className="mt-10 text-center text-sm/6 text-gray-100">
                Not Login yet?  <NavLink to="/login"  className="font-semibold text-zinc-400 
              hover:text-zinc-200">
                    login
                </NavLink>
            </p>

        </div>

    </div>
  )
}

export default Signup
