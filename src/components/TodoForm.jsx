import React, { useState } from 'react'
import { useContextAPI } from '../ContextAPI';
import { Navigate } from 'react-router-dom';

function TodoForm() {
  
  const [todo, setTodo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addTodo, isLoggedIn, user, theme } = useContextAPI();
  
  const add = async (e) => {
    e.preventDefault();

    if(!todo.trim()) return;

    if (!user) {
      alert("Please login to add todos");
      return;
    }
    
    setIsSubmitting(true);

    try {
      await addTodo({ 
        todo: todo.trim(), 
        completed: false 
      });
      
      setTodo("");

    } catch (error) {
      console.error("Error adding todo:", error);
      alert("Failed to add todo. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isLoggedIn) {
    return <Navigate to={'/'}/>;
  }

  return (
    <form onSubmit={add} className="flex">
      <input 
          type="text" 
          placeholder="Write Todo..." 
          className={`w-full border rounded-l-lg px-3 outline-none duration-150 py-1.5 ${
              theme === 'dark' 
                  ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                  : 'border-black/10 bg-white/20 text-black placeholder-gray-600'
          }`}
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          disabled={isSubmitting}
      />
      <button 
          type="submit" 
          className={`rounded-r-lg px-3 py-1 text-white shrink-0 ${
            isSubmitting 
                ? 'bg-gray-400' 
                : theme === 'dark' ? 'bg-green-700 hover:bg-green-600' : 'bg-green-600 hover:bg-green-700'
          }`}
          disabled={isSubmitting || !todo.trim() || !user}
      >
        {isSubmitting ? 'Adding...' : 'Add'}
      </button>
    </form>
  )
}

export default TodoForm