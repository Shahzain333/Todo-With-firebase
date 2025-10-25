import React from 'react'
import { useContextAPI } from '../ContextAPI';

function TodoItem({ todo }) {
  const [isTodoEditable, setIsTodoEditable] = React.useState(false);
  const [todoMsg, setTodoMsg] = React.useState(todo.todo);
  const { updateTodo, deleteTodo, toggleComplete, theme } = useContextAPI();

  const editTodo = async () => {
    try {
      await updateTodo(todo.id, { ...todo, todo: todoMsg });
      setIsTodoEditable(false);
    } catch (error) {
      console.error("Error updating todo:", error);
      alert("Failed to update todo");
    }
  }

  const toggleCompleted = async () => {
    try {
      await toggleComplete(todo.id);
    } catch (error) {
      console.error("Error toggling todo:", error);
      alert("Failed to update todo");
    }
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this todo?")) {
      try {
        await deleteTodo(todo.id);
      } catch (error) {
        console.error("Error deleting todo:", error);
        alert("Failed to delete todo");
      }
    }
  }
  
  return (
    <div className={`flex border rounded-lg px-3 py-1.5 gap-x-3 shadow-sm duration-300 ${
        theme === 'dark' 
            ? `border-gray-600 ${todo.completed ? "bg-green-900 text-white" : "bg-gray-700 text-white"}` 
            : `border-black/10 ${todo.completed ? "bg-[#c6e9a7] text-black" : "bg-[#ccbed7] text-black"}`
    }`}>
            
      <input 
        type="checkbox" 
        className="cursor-pointer" 
        checked={todo.completed} 
        onChange={toggleCompleted}
      />

      <input 
        type="text" 
        className={`border outline-none w-full bg-transparent rounded-lg ${
            isTodoEditable 
                ? theme === 'dark' ? "border-gray-400 px-2" : "border-black/10 px-2" 
                : "border-transparent"
        } ${todo.completed ? "line-through" : ""}`} 
        value={todoMsg}
        onChange={(e) => setTodoMsg(e.target.value)} 
        readOnly={!isTodoEditable}
      />

      {/* Edit, Save Button */}
      <button 
        className={`inline-flex w-8 h-8 rounded-lg text-sm border justify-center items-center shrink-0 disabled:opacity-50 ${
            theme === 'dark' 
                ? "border-gray-600 bg-gray-600 hover:bg-gray-500 text-white" 
                : "border-black/10 bg-gray-50 hover:bg-gray-100 text-black"
        }`}
        onClick={async () => {
          if (todo.completed) return;

          if (isTodoEditable) {
            await editTodo();
          } else {
            setIsTodoEditable((prev) => !prev);
          }
        }}
        disabled={todo.completed}
      >
        {isTodoEditable ? "📁" : "✏️"}
      </button>

      {/* Delete Todo Button */}
      <button 
        className={`inline-flex w-8 h-8 rounded-lg text-sm border justify-center items-center shrink-0 ${
            theme === 'dark' 
                ? "border-gray-600 bg-gray-600 hover:bg-gray-500 text-white" 
                : "border-black/10 bg-gray-50 hover:bg-gray-100 text-black"
        }`}
        onClick={handleDelete}
      >
        ❌
      </button>
    </div>
  )
}

export default TodoItem