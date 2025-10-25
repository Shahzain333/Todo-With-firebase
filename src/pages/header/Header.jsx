import React, { useState } from 'react'
import { useContextAPI } from '../../ContextAPI'
import { Link } from 'react-router-dom'
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

function Header() {
    
    const { 
        isLoggedIn, 
        user, 
        logoutUser, 
        theme, 
        toggleTheme,
        searchTerm,
        setSearchTerm,
        searchTodos,
        clearSearch
    } = useContextAPI()
    
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    const handleLogout = () => {
        logoutUser()
        setIsMobileMenuOpen(false)
    }

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (value.trim()) {
            searchTodos(value);
        } else {
            clearSearch();
        }
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            searchTodos(searchTerm);
        }
    }

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
        if (isSearchOpen) {
            clearSearch();
        }
    }

    return (
        <header className={`shadow-sm ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
         
                    {/* Logo */}
                    <Link 
                        to="/" 
                        className={`text-2xl font-bold ${
                            theme === 'dark' ? 'text-white' : 'text-gray-800'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        📝 TodoApp
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-4">
                        {/* Search Bar */}
                        {isLoggedIn && (
                            
                            <div className="relative">
                            
                                {isSearchOpen ? (
                                    
                                    <form onSubmit={handleSearchSubmit} className="flex items-center">
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                            placeholder="Search todos..."
                                            className={`px-4 py-2 rounded-lg border transition-colors duration-200 ${
                                                theme === 'dark' 
                                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                                    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                                            } focus:outline-none focus:ring-2 focus:ring-blue-500 w-64`}
                                            autoFocus
                                        />
                                    
                                        <button
                                            type="button"
                                            onClick={toggleSearch}
                                            className={`ml-2 p-2 rounded-lg transition-colors duration-200 ${
                                                theme === 'dark' 
                                                    ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                                                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                            }`}
                                        >
                                            <ClearIcon />
                                        </button>
                                    
                                    </form>
                                ) : (
                                    <button
                                        onClick={toggleSearch}
                                        className={`p-2 rounded-lg transition-colors duration-200 ${
                                            theme === 'dark' 
                                                ? 'bg-gray-700 text-white hover:bg-gray-600' 
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                        aria-label="Search todos"
                                    >
                                        <SearchIcon />
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Theme Toggle */}
                        <button
                            onClick={() => toggleTheme(theme === 'dark' ? 'light' : 'dark')}
                            className={`p-2 rounded-lg transition-colors duration-200 ${
                                theme === 'dark' 
                                    ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? '☀️' : '🌙'}
                        </button>

                        {isLoggedIn ? (
                            <>
                                <Link 
                                    to="/todos" 
                                    className={`font-medium transition-colors duration-200 ${
                                        theme === 'dark' 
                                        ? 'text-white hover:text-gray-300' 
                                        : 'text-gray-700 hover:text-gray-900'
                                    }`}
                                >
                                    My Todos
                                </Link>
                                <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Welcome, {user?.email}
                                </span>
                                <button
                                    onClick={logoutUser}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                                        theme === 'dark' 
                                            ? 'bg-red-600 hover:bg-red-700 text-white' 
                                            : 'bg-red-500 hover:bg-red-600 text-white'
                                    }`}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <div className="flex gap-4">
                                <Link 
                                    to="/login" 
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                                        theme === 'dark' 
                                            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                                    }`}
                                >
                                    Login
                                </Link>
                            </div>
                        )}
                    </nav>

                    {/* Mobile menu button */}
                    <div className="flex md:hidden items-center gap-2">
                        {/* Search Toggle for mobile */}
                        {isLoggedIn && (
                            <button
                                onClick={toggleSearch}
                                className={`p-2 rounded-lg transition-colors duration-200 ${
                                    theme === 'dark' 
                                        ? 'bg-gray-700 text-white hover:bg-gray-600' 
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                                aria-label="Search todos"
                            >
                                <SearchIcon />
                            </button>
                        )}

                        {/* Theme Toggle for mobile */}
                        <button
                            onClick={() => toggleTheme(theme === 'dark' ? 'light' : 'dark')}
                            className={`p-2 rounded-lg transition-colors duration-200 ${
                                theme === 'dark' 
                                    ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? '☀️' : '🌙'}
                        </button>

                        <button
                            onClick={toggleMobileMenu}
                            className={`p-2 rounded-lg transition-colors duration-200 ${
                                theme === 'dark' 
                                    ? 'bg-gray-700 text-white hover:bg-gray-600' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                        </button>

                    </div>
                    
                </div>

                {/* Mobile Search Bar */}
                {isSearchOpen && isLoggedIn && (
                    <div className={`md:hidden py-3 border-t ${
                        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                        <form onSubmit={handleSearchSubmit} className="px-4">
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    placeholder="Search todos..."
                                    className={`flex-1 px-4 py-2 rounded-lg border transition-colors duration-200 ${
                                        theme === 'dark' 
                                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                            : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={toggleSearch}
                                    className={`ml-2 p-2 rounded-lg transition-colors duration-200 ${
                                        theme === 'dark' 
                                            ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                    }`}
                                >
                                    <ClearIcon />
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Mobile Navigation Menu */}
                {isMobileMenuOpen && (
                    <div className={`md:hidden py-4 border-t ${
                        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                        <nav className="flex flex-col space-y-4">
                            {isLoggedIn ? (
                                <>
                                    <Link 
                                        to="/todos" 
                                        className={`px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                                            theme === 'dark' 
                                                ? 'text-white hover:bg-gray-700' 
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        My Todos
                                    </Link>
                                    <div className={`px-4 py-3 text-sm ${
                                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                        Welcome, {user?.email?.split('@')[0]}
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className={`px-4 py-3 rounded-lg font-medium text-left transition-colors duration-200 ${
                                            theme === 'dark' 
                                                ? 'bg-red-600 hover:bg-red-700 text-white' 
                                                : 'bg-red-500 hover:bg-red-600 text-white'
                                        }`}
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link 
                                    to="/login" 
                                    className={`px-4 py-3 rounded-lg font-medium text-center transition-colors duration-200 ${
                                        theme === 'dark' 
                                            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                                    }`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Login
                                </Link>
                            )}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    )
}

export default Header;