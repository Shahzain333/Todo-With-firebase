import React, { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useContextAPI } from '../../ContextAPI'
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

function Signup() {
    
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [snackbarSeverity, setSnackbarSeverity] = useState('error') // 'error' or 'success'
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [confirmPasswordError, setConfirmPasswordError] = useState('')
    
    const { signupUserWithEmailAndPassword, isLoggedIn, theme } = useContextAPI()

    if (isLoggedIn) {
        return <Navigate to="/todos" />
    }

    // Email validation regex
    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    // Password validation
    const validatePassword = (password) => {
        return password.length >= 6; // Firebase requires at least 6 characters
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        
        // Clear error when user starts typing
        if (emailError) {
            setEmailError('');
        }
        
        // Real-time validation
        if (value && !validateEmail(value)) {
            setEmailError('Please enter a valid email address');
        } else {
            setEmailError('');
        }
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        
        if (passwordError) {
            setPasswordError('');
        }
        
        // Real-time password validation
        if (value && !validatePassword(value)) {
            setPasswordError('Password must be at least 6 characters long');
        } else {
            setPasswordError('');
        }

        // Check confirm password if it's already filled
        if (confirmPassword && value !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match');
        } else if (confirmPasswordError) {
            setConfirmPasswordError('');
        }
    };

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
        
        if (confirmPasswordError) {
            setConfirmPasswordError('');
        }
        
        // Real-time confirm password validation
        if (value && password !== value) {
            setConfirmPasswordError('Passwords do not match');
        } else {
            setConfirmPasswordError('');
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

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        // Clear previous errors
        setError('');
        setEmailError('');
        setPasswordError('');
        setConfirmPasswordError('');

        // Validation
        if (!email || !password || !confirmPassword) {
            showSnackbar('Please fill in all fields');
            return;
        }

        if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address');
            showSnackbar('Please enter a valid email address');
            return;
        }

        if (!validatePassword(password)) {
            setPasswordError('Password must be at least 6 characters long');
            showSnackbar('Password must be at least 6 characters long');
            return;
        }

        if (password !== confirmPassword) {
            setConfirmPasswordError("Passwords don't match!");
            showSnackbar("Passwords don't match!");
            return;
        }

        setIsLoading(true)
        
        try {
            await signupUserWithEmailAndPassword(email, password)
            // Clear form on success
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            // Show success message
            showSnackbar('Account created successfully! You can now sign in.', 'success');
     
        } catch (error) {
            let errorMessage = 'Signup failed. Please try again.';
            
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'An account with this email already exists.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Invalid email address format.';
                    setEmailError('Please enter a valid email address');
                    break;
                case 'auth/operation-not-allowed':
                    errorMessage = 'Email/password accounts are not enabled.';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'Password is too weak. Please use a stronger password.';
                    setPasswordError('Password is too weak. Please use a stronger password.');
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'Network error. Please check your connection.';
                    break;
                case 'auth/popup-closed-by-user':
                    errorMessage = 'Signup cancelled. Please try again.';
                    break;
                case 'auth/popup-blocked':
                    errorMessage = 'Popup was blocked by your browser. Please allow popups for this site.';
                    break;
                default:
                    errorMessage = error.message || 'Signup failed. Please try again.';
            }
            
            showSnackbar(errorMessage);
            console.error("Signup error:", error);
        } finally {
            setIsLoading(false)
        }
    }

    // Check if form is valid for submit button
    const isFormValid = email && 
                       password && 
                       confirmPassword && 
                       !emailError && 
                       !passwordError && 
                       !confirmPasswordError &&
                       validateEmail(email) &&
                       validatePassword(password) &&
                       password === confirmPassword;

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
                    Create your account
                </h2>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className={`block text-sm font-medium ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={handleEmailChange}
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
                            <label htmlFor="password" className={`block text-sm font-medium ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                Password
                            </label>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={handlePasswordChange}
                                    className={`block w-full rounded-md px-3 py-2 text-base border ${
                                        theme === 'dark' 
                                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                    } ${
                                        passwordError 
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                                            : 'focus:border-blue-500 focus:ring-blue-500'
                                    } focus:outline-none focus:ring-2 sm:text-sm`}
                                    placeholder="Create a password"
                                />
                                {passwordError && (
                                    <p className="mt-1 text-sm text-red-500">{passwordError}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className={`block text-sm font-medium ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                Confirm Password
                            </label>
                            <div className="mt-2">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    className={`block w-full rounded-md px-3 py-2 text-base border ${
                                        theme === 'dark' 
                                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                    } ${
                                        confirmPasswordError 
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                                            : 'focus:border-blue-500 focus:ring-blue-500'
                                    } focus:outline-none focus:ring-2 sm:text-sm`}
                                    placeholder="Confirm your password"
                                />
                                {confirmPasswordError && (
                                    <p className="mt-1 text-sm text-red-500">{confirmPasswordError}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading || !isFormValid}
                            className={`flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 ${
                                theme === 'dark' 
                                    ? 'bg-blue-600 hover:bg-blue-700 focus-visible:outline-blue-600' 
                                    : 'bg-blue-500 hover:bg-blue-600 focus-visible:outline-blue-500'
                            } cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200`}
                        >
                            {isLoading ? 'Creating account...' : 'Create account'}
                        </button>
                    
                    </div>

                    {/* Not logged in yet section moved below */}
                    <div className="text-center">
                        <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                            Not logged in yet?{' '}
                            <Link 
                                to="/login" 
                                className={`font-semibold ${
                                    theme === 'dark' 
                                        ? 'text-blue-400 hover:text-blue-300' 
                                        : 'text-blue-600 hover:text-blue-500'
                                } transition-colors duration-200`}
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default Signup