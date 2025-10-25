import React, { useContext, useState, useEffect } from 'react'
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import { NavLink } from 'react-router-dom'
import { useContextAPI } from '../../ContextAPI';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState('error'); // 'error' or 'success'
    const [emailError, setEmailError] = useState('');

    const navigate = useNavigate();
    const { theme, isLoggedIn, signinUserWithEmailAndPassword, signinWithGoogle, signinWithGithub } = useContextAPI();

    if(isLoggedIn){
        navigate('/todos');
    }

    // Email validation regex
    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        
        // Clear error when user starts typing
        if (emailError) {
            setEmailError('');
        }
        
        // Real-time validation (optional)
        if (value && !validateEmail(value)) {
            setEmailError('Please enter a valid email address');
        } else {
            setEmailError('');
        }
    };

    const showSnackbar = (message, severity = 'error') => {
        setSnackbarSeverity(severity);
        if (severity === 'error') {
            setError(message);
        } else {
            setSuccess(message);
        }
        setOpenSnackbar(true);
    };

    const handleCloseSnackbar = (reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
        setError('');
        setSuccess('');
    };

    const login = async (e) => {
        e.preventDefault();
        setError('');
        setEmailError('');
        
        // Basic validation
        if (!email || !password) {
            showSnackbar('Please enter both email and password');
            return;
        }

        // Email format validation
        if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address');
            showSnackbar('Please enter a valid email address');
            return;
        }

        try {
            await signinUserWithEmailAndPassword(email,password);
            setEmail('');
            setPassword('');
            // Show success message
            showSnackbar('Successfully signed in!', 'success');
        } catch (error) {
            let errorMessage = 'Login failed. Please try again.';
            
            switch (error.code) {
                case 'auth/invalid-email':
                    errorMessage = 'Invalid email address format.';
                    setEmailError('Please enter a valid email address');
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'This account has been disabled.';
                    break;
                case 'auth/user-not-found':
                    errorMessage = 'No account found with this email address.';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Incorrect password. Please try again.';
                    break;
                case 'auth/invalid-credential':
                    errorMessage = 'Invalid email or password. Please check your credentials.';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Too many failed attempts. Please try again later.';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'Network error. Please check your connection.';
                    break;
                case 'auth/popup-closed-by-user':
                    errorMessage = 'Login cancelled. Please try again.';
                    break;
                case 'auth/account-exists-with-different-credential':
                    errorMessage = 'An account already exists with the same email but different sign-in method.';
                    break;
                case 'auth/popup-blocked':
                    errorMessage = 'Popup was blocked by your browser. Please allow popups for this site.';
                    break;
                default:
                    errorMessage = error.message || 'Login failed. Please try again.';
            }
            
            showSnackbar(errorMessage);
            console.error("Login error:", error);
        }
    }

    const handleGitHubLogin = async () => {
        try {
            await signinWithGithub();
            // Show success message for social login
            showSnackbar('Successfully signed in with GitHub!', 'success');
        } catch (error) {
            let errorMessage = 'GitHub login failed. Please try again.';
            
            switch (error.code) {
                case 'auth/popup-closed-by-user':
                    errorMessage = 'Login cancelled. Please try again.';
                    break;
                case 'auth/popup-blocked':
                    errorMessage = 'Popup was blocked by your browser. Please allow popups for this site.';
                    break;
                case 'auth/account-exists-with-different-credential':
                    errorMessage = 'An account already exists with the same email but different sign-in method.';
                    break;
                default:
                    errorMessage = error.message || 'GitHub login failed. Please try again.';
            }
            
            showSnackbar(errorMessage);
        }
    }

    const handleGoogleLogin = async () => {
        try {
            await signinWithGoogle();
            // Show success message for social login
            showSnackbar('Successfully signed in with Google!', 'success');
        } catch (error) {
            let errorMessage = 'Google login failed. Please try again.';
            
            switch (error.code) {
                case 'auth/popup-closed-by-user':
                    errorMessage = 'Login cancelled. Please try again.';
                    break;
                case 'auth/popup-blocked':
                    errorMessage = 'Popup was blocked by your browser. Please allow popups for this site.';
                    break;
                case 'auth/account-exists-with-different-credential':
                    errorMessage = 'An account already exists with the same email but different sign-in method.';
                    break;
                default:
                    errorMessage = error.message || 'Google login failed. Please try again.';
            }
            
            showSnackbar(errorMessage);
        }
    }
 
    return (
        <div className={`min-h-screen flex flex-col justify-center px-6 py-12 lg:px-8 ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
        }`}>

            <Snackbar 
                open={openSnackbar} 
                autoHideDuration={6000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    severity={snackbarSeverity}
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={handleCloseSnackbar}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    sx={{ width: '100%' }}
                >
                    {snackbarSeverity === 'success' ? success : error}
                </Alert>
            </Snackbar>

            <div className={`sm:mx-auto sm:w-full sm:max-w-sm p-4 sm:p-8 rounded-2xl shadow-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
                
                <h2 className={`text-center text-2xl font-bold leading-9 tracking-tight ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                    Sign in to your account
                </h2>

                <form action="#" method="POST" onSubmit={login} className="space-y-6 mt-8">
                    
                    <div>
                        <label htmlFor="email" className={`block text-sm font-medium ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                            Email
                        </label>
                        <div className="mt-2">
                            <input 
                                id="email" 
                                type="email" 
                                name="email" 
                                value={email}
                                onChange={handleEmailChange}
                                required 
                                autoComplete="email" 
                                className={`block w-full rounded-md px-3 py-2 text-base border ${
                                    theme === 'dark' 
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                } ${
                                    emailError 
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                                        : 'focus:border-blue-500 focus:ring-blue-500'
                                } focus:outline-none focus:ring-2 sm:text-sm`}
                                placeholder="Enter your email"
                            />
                            {emailError && (
                                <p className="mt-1 text-sm text-red-500">{emailError}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className={`block text-sm font-medium ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                Password
                            </label>
                        </div>
                        <div className="mt-2">
                            <input 
                                id="password" 
                                type="password" 
                                name="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                                autoComplete="current-password" 
                                className={`block w-full rounded-md px-3 py-2 text-base border ${
                                    theme === 'dark' 
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500' 
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500'
                                } focus:outline-none focus:ring-2 sm:text-sm`}
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>

                    <div>
                        <button 
                            type="submit" 
                            className={`flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 ${
                                theme === 'dark' 
                                    ? 'bg-blue-600 hover:bg-blue-700 focus-visible:outline-blue-600' 
                                    : 'bg-blue-500 hover:bg-blue-600 focus-visible:outline-blue-500'
                            } cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200`}
                            disabled={!email || !password || !!emailError}
                        >
                            Sign in
                        </button>
                    </div>

                </form>

                <p className={`mt-6 text-center text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                    Not registered yet?{' '}
                    <NavLink 
                        to="/signup" 
                        className={`font-semibold ${
                            theme === 'dark' 
                                ? 'text-blue-400 hover:text-blue-300' 
                                : 'text-blue-600 hover:text-blue-500'
                        } transition-colors duration-200`}
                    >
                        Register
                    </NavLink>
                </p>

                <div className="mt-6">
                    
                    <div className="relative">
                 
                        <div className="absolute inset-0 flex items-center">
                            <div className={`w-full border-t ${
                                theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
                            }`}></div>
                        </div>
                 
                        <div className="relative flex justify-center text-sm">
                            <span className={`px-2 ${
                                theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'
                            }`}>
                                Or continue with
                            </span>
                        </div>
                 
                    </div>

                    <div className='flex flex-col sm:flex-row items-center justify-center gap-3 mt-4'>
                 
                        <button 
                            type="button" 
                            className={`flex w-full justify-center items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 transition-all duration-200 ${
                                theme === 'dark' 
                                    ? 'bg-gray-700 text-white hover:bg-gray-600 focus-visible:outline-gray-600' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus-visible:outline-gray-300'
                            } cursor-pointer hover:scale-105`}
                            onClick={handleGoogleLogin}
                        >
                            <GoogleIcon fontSize='small'/>
                            Google
                        </button>
                 
                        <button 
                            type="button" 
                            className={`flex w-full justify-center items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 transition-all duration-200 ${
                                theme === 'dark' 
                                    ? 'bg-gray-700 text-white hover:bg-gray-600 focus-visible:outline-gray-600' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus-visible:outline-gray-300'
                            } cursor-pointer hover:scale-105`}
                            onClick={handleGitHubLogin}
                        >
                            <GitHubIcon fontSize='small'/>
                            GitHub
                        </button>
                 
                    </div>
                
                </div>

            </div>

        </div>
    )
}

export default Login