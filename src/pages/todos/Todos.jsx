import React from 'react'
import TodoForm from '../../components/TodoForm';
import TodoItem from '../../components/TodoItem';
import { useContextAPI } from '../../ContextAPI';
import { Navigate } from 'react-router-dom';

function Todos() {

    const { todos, loading, user, isLoggedIn, theme, searchTerm, filteredTodos } = useContextAPI();
    
    // If user is not logged in, Navigate to the home page
    if (!isLoggedIn || !user) {
        return (
           <Navigate to={'/'}/>
        );
    }

    // Show loading state
    if (loading) {
        return (
            <div className={`h-[585px] py-8 flex items-center justify-center ${
                theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
            }`}>
                <div className={`w-full max-w-2xl mx-auto shadow-md rounded-lg px-4 py-8 text-center ${
                    theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
                }`}>
                    <h1 className="text-2xl font-bold mb-4">Loading...</h1>
                    <p className="text-lg">Fetching your todos</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-[585px] py-8 ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
        }`}>
            
            <div className={`w-full max-w-2xl mx-auto shadow-md rounded-lg px-4 py-3 ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
                
                <h1 className={`text-2xl font-bold text-center mb-8 mt-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>
                    Manage Your Todos
                </h1>
                
                <div className="mb-4">
                    <TodoForm />
                </div>
                
                {/* Empty state - only show when not searching */}
                {!searchTerm && todos.length === 0 && !loading && (
                    <div className="text-center py-8">
                        <p className={`text-lg ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                            No todos yet. Add your first todo above!
                        </p>
                    </div>
                )}

                {/* Search results message */}
                {searchTerm && filteredTodos.length === 0 && !loading && (
                    <div className="text-center py-4">
                        <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                            No todos found for "{searchTerm}"
                        </p>
                    </div>
                )}
                                
                {/* Todos list */}
                <div className="flex flex-wrap gap-y-3">
                    {(searchTerm && filteredTodos.length > 0 ? filteredTodos : todos).map((todo) => (
                        <div key={todo.id} className="w-full">
                            <TodoItem todo={todo} />
                        </div>
                    ))}
                </div>

                {/* Todo count - Now with theme support */}
                {todos.length > 0 && !searchTerm && (
                    <div className="mt-6 text-center">
                        <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                            {
                                todos.filter(todo => todo.completed).length
                            } of {todos.length} todos completed
                        </p>
                    </div>
                )}

            </div>
        </div>
    );
}

export default Todos;