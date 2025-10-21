import React, { useState } from 'react'
import { useContextAPI } from '../ContextAPI';
import Home from '../pages/home/Home'
import { Navigate } from 'react-router-dom';

function TodoForm() {
  
  const [todo, setTodo] = useState("");

  const { addTodo, isLoggedIn, user } = useContextAPI();
  
  const add = (e) => {
    
    e.preventDefault();

    if(!todo.trim() || !user ) return;
    
    try {
      addTodo({ 
        todo: todo.trim(), 
        completed: false 
      });
      
      setTodo(""); // Clear input after successful addition

    } catch (error) {
      console.error("Error adding todo:", error);
      alert("Failed to add todo. Please try again.");
    }

  }

  return (
    <div>
    
      {isLoggedIn ? (
        <form onSubmit={add}  className="flex">
          <input 
              type="text" 
              placeholder="Write Todo..." 
              className="w-full border border-black/10 
              rounded-l-lg px-3 outline-none duration-150 bg-white/20 py-1.5" 
              value={todo}
              onChange={(e) => setTodo(e.target.value)}
          />
          <button type="submit" className="rounded-r-lg px-3 py-1 bg-green-600 text-white shrink-0">
              Add
          </button>
        </form> ) : (
          <Navigate to={'/'}/>
        ) 
         
      }
    
    </div>
    
  )
}

export default TodoForm
