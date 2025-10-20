import React from 'react'
import { useContextAPI } from '/src/components/ContextAPI'
import { NavLink } from 'react-router-dom'

function Home() {

    const { isLoggedIn, user } = useContextAPI();

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
            
            <div className="text-center">
                
                {isLoggedIn ? (
                    <>
                        <h1 className="text-4xl font-bold mb-4">
                            Welcome to Your TODO App!
                        </h1>
                        <p className="text-xl mb-8">
                            You are successfully logged in. Start managing your tasks!
                        </p>
                        <NavLink 
                            to="/" 
                            className="bg-zinc-700 hover:bg-zinc-600 text-white px-6 py-3 rounded-md font-semibold"
                        >
                            Go to My Todos
                        </NavLink>
                    </>
                ) : (
                    <>
                        <h1 className="text-4xl font-bold mb-4">
                            Welcome to TODO App
                        </h1>
                        <p className="text-xl mb-8">
                            Please login to access your tasks
                        </p>
                    </>
                )}
            
            </div>
        
        </div>
    )
}

export default Home