import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useContextAPI } from '../../components/ContextAPI'
import { useNavigate } from 'react-router-dom'
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

function Signup() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [success, setSuccess] = useState('');
    const [snackbarType, setSnackbarType] = useState('error'); // 'error' or 'success'
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const context = useContextAPI();
    const navigate = useNavigate();

    // Email Validation Regex
    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    // Password Validation Regex
    const validatePassword = (password) => {
        // At least 6 characters, at least one letter and one number
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
        return passwordRegex.test(password);
    }

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);

        // Clear error when user starts typing
        if(emailError){
            setEmailError('');
        }

        // Real-time validation
        if(value && !validateEmail(value)){
            setEmailError('Please enter a valid email address');
        } else {
            setEmailError('');
        }
    }

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);

        // Clear error when user starts typing
        if(passwordError){
            setPasswordError('');
        }

        // Real-time validation
        if(value && !validatePassword(value)){
            setPasswordError('Password must be at least 6 characters with at least one letter and one number');
        } else {
            setPasswordError('');
        }
    }

    const handleCloseSnackbar = (reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
        setError('');
        setSuccess('');
    };

    const createAccount = async (e) => {
        e.preventDefault();
        
        setError('');
        setSuccess('');
        setEmailError('');
        setPasswordError('');
        
        // Basic validation
        if (!email || !password) {
            setError('Please enter both email and password');
            setSnackbarType('error');
            setOpenSnackbar(true);
            return;
        }

        // Email format validation
        if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address');
            setError('Please enter a valid email address');
            setSnackbarType('error');
            setOpenSnackbar(true);
            return;
        }

        // Password strength validation
        if (!validatePassword(password)) {
            setPasswordError('Password must be at least 6 characters with at least one letter and one number');
            setError('Password must be at least 6 characters with at least one letter and one number');
            setSnackbarType('error');
            setOpenSnackbar(true);
            return;
        }

        try {
            
            const result = await context.signupUserWithEmailAndPassword(email,password);
            // console.log("Result :", result)

            // IMPORTANT: Sign out the user immediately after signup
            await context.logoutUser();
            
            // Show success message and redirect to login
            setSuccess('Account created successfully!');
            setSnackbarType('success');
            setOpenSnackbar(true);
            
            // Clear form
            setEmail('');
            setPassword('');
            
            // Redirect to login page after a short delay
            setTimeout(() => {
                navigate('/login');
            }, 2000);
            
        } catch (error) {

            let errorMessage = 'Signup failed. Please try again.';
            
            // Handle specific Firebase auth errors
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'This email is already registered. Please use a different email or try logging in.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Invalid email address format.';
                    setEmailError('Please enter a valid email address');
                    break;
                case 'auth/operation-not-allowed':
                    errorMessage = 'Email/password accounts are not enabled. Please contact support.';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'Password is too weak. Please choose a stronger password with at least one letter and one number.';
                    setPasswordError('Password must be at least 6 characters with at least one letter and one number');
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'Network error. Please check your connection.';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Too many attempts. Please try again later.';
                    break;
                default:
                    errorMessage = error.message || 'Signup failed. Please try again.';
            }
            
            setError(errorMessage);
            setSnackbarType('error');
            setOpenSnackbar(true);
            console.error("Signup error:", error);
        }
    }

    // Check if form is valid for submit button
    const isFormValid = () => {
        return email && password && validateEmail(email) && validatePassword(password);
    }

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">

        {/* Snackbar for both error and success */}
        <Snackbar 
            open={openSnackbar} 
            autoHideDuration={6000} 
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Alert 
                severity={snackbarType}
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
                {snackbarType === 'success' ? success : error}
            </Alert>
        </Snackbar>

        <div className="sm:mx-auto sm:w-full sm:max-w-sm bg-zinc-900 dark:bg-zinc-800 
        p-4 sm:p-8 rounded-2xl shadow-lg">
            
            <form action="#" method="POST" onSubmit={createAccount} className="space-y-6">
                
                <div>
                    <label htmlFor="email" className="block text-lg font-medium text-gray-100">
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
                            className={`block w-full rounded-md bg-white/5 px-3 py-1.5 text-base 
                            text-white outline-1 -outline-offset-1 placeholder:text-gray-500 
                            focus:outline-2 focus:-outline-offset-2 sm:text-sm/6
                            ${emailError ? 'outline-red-500 focus:outline-red-500' : 'outline-white/10 focus:outline-zinc-500'}`}
                            placeholder="Enter your email"
                        />
                        {emailError && (
                            <p className="mt-1 text-sm text-red-500">{emailError}</p>
                        )}
                    </div>
                </div>

                <div>
                    <label htmlFor="password" className="block text-lg font-medium text-gray-100">Password</label>
                    <div className="mt-2">
                        <input 
                            id="password" 
                            type="password" 
                            name="password" 
                            value={password}
                            onChange={handlePasswordChange}
                            required 
                            autoComplete="new-password" 
                            className={`block w-full rounded-md bg-white/5 px-3 py-1.5 text-base 
                            text-white outline-1 -outline-offset-1 placeholder:text-gray-500 
                            focus:outline-2 focus:-outline-offset-2 sm:text-sm/6
                            ${passwordError ? 'outline-red-500 focus:outline-red-500' : 'outline-white/10 focus:outline-zinc-500'}`}
                            placeholder="Enter your password"
                        />
                        {passwordError && (
                            <p className="mt-1 text-sm text-red-500">{passwordError}</p>
                        )}
                    </div>
                    <p className="mt-1 text-sm text-gray-400">
                        Password must be at least 6 characters with at least one letter and one number
                    </p>
                </div>

                <div>
                    <button 
                        type="submit" 
                        className="flex w-full justify-center rounded-md bg-zinc-700 px-3 py-1.5 
                        text-sm/6 font-semibold text-white hover:bg-zinc-600 
                        focus-visible:outline-2 focus-visible:outline-offset-2 
                        focus-visible:outline-zinc-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!isFormValid()}
                    >
                        Sign up
                    </button>
                </div>

            </form>

            <p className="mt-10 text-center text-sm/6 text-gray-100">
                Already have an account?  <NavLink to="/login"  className="font-semibold text-zinc-400 
              hover:text-zinc-200">
                    Login
                </NavLink>
            </p>

        </div>

    </div>
  )
}

export default Signup