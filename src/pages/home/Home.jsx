import React from 'react'
import { Link } from 'react-router-dom'
import { useContextAPI } from '../../ContextAPI'

function Home() {
    const { theme, isLoggedIn } = useContextAPI()

    // Features array for easy management
    const features = [
        {
            id: 1,
            icon: '📝',
            title: 'Easy Task Management',
            description: 'Create, edit, and organize your todos with a simple and intuitive interface.'
        },
        {
            id: 2,
            icon: '⚡',
            title: 'Real-time Sync',
            description: 'Your todos sync across all devices instantly. Never lose your progress.'
        },
        {
            id: 3,
            icon: '🎯',
            title: 'Stay Focused',
            description: 'Mark tasks as completed and track your productivity with visual progress indicators.'
        }
    ]

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
            <div className="max-w-6xl mx-auto px-4 py-16">
                
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-800'
                    }`}>
                        Organize Your Life
                    </h1>
                    <p className={`text-xl mb-8 max-w-2xl mx-auto ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                        A simple and powerful todo app to manage your tasks, boost your productivity, 
                        and achieve your goals.
                    </p>
                    
                </div>

                {/* Features Section */}
                <div className={`grid md:grid-cols-3 gap-8 mt-20 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>
                    {features.map((feature) => (
                        <div 
                            key={feature.id}
                            className={`p-6 rounded-xl ${
                                theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-lg'
                            }`}
                        >
                            <div className="text-4xl mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* CTA Section */}
                {!isLoggedIn && (
                    <div className={`text-center mt-20 p-8 rounded-xl ${
                        theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-lg'
                    }`}>
                        <h2 className={`text-3xl font-bold mb-4 ${
                            theme === 'dark' ? 'text-white' : 'text-gray-800'
                        }`}>
                            Ready to Boost Your Productivity?
                        </h2>
                        <p className={`mb-6 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                            Join thousands of users who are already organizing their lives with our todo app.
                        </p>
                        <Link 
                            to="/signup" 
                            className={`px-4 py-2 sm:px-8 sm:py-3 rounded-lg text-lg font-semibold ${
                                theme === 'dark' 
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                            }`}
                        >
                            Create Free Account
                        </Link>
                    </div>
                )}

            </div>
        </div>
    )
}

export default Home