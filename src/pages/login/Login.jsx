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
import { jsx } from 'react/jsx-runtime';

function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [emailError, setEmailError] = useState('');

    const navigate = useNavigate();
    const context = useContextAPI();

    useEffect(() => {
        if(context.isLoggedIn){
            navigate('/');
        }
    }, [context, navigate])

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

    const handleCloseSnackbar = (reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
        setError('');
    };

    const login = async (e) => {
        e.preventDefault();
        setError('');
        setEmailError('');
        
        // Basic validation
        if (!email || !password) {
            setError('Please enter both email and password');
            setOpenSnackbar(true);
            return;
        }

        // Email format validation
        if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address');
            setError('Please enter a valid email address');
            setOpenSnackbar(true);
            return;
        }

        try {
            const result = await context.signinUserWithEmailAndPassword(email,password);
            //localStorage.setItem('User : ',JSON.stringify(result))
            
            setEmail('');
            setPassword('');

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
            
            setError(errorMessage);
            setOpenSnackbar(true);
            console.error("Login error:", error);
        }
    }

    const handleGitHubLogin = async () => {
        try {
            await context.signinWithGithub();
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
            
            setError(errorMessage);
            setOpenSnackbar(true);
        }
    }

    const handleGoogleLogin = async () => {
        try {
            await context.signinWithGoogle();
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
            
            setError(errorMessage);
            setOpenSnackbar(true);
        }
    }
 
    return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">

        <Snackbar 
            open={openSnackbar} 
            autoHideDuration={6000} 
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Alert 
                severity="error"
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
                {error}
            </Alert>
        </Snackbar>

        <div className="sm:mx-auto sm:w-full sm:max-w-sm bg-zinc-900 dark:bg-zinc-800 p-4 sm:p-8 rounded-2xl shadow-lg">
            
            <form action="#" method="POST" onSubmit={login} className="space-y-2">
                
                <div>
                    <label htmlFor="email" className="block text-lg font-medium text-gray-100">Email</label>
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
                    <div className="flex items-center justify-between">
                        <label htmlFor="password" className="block text-lg font-medium text-gray-100">Password</label>
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
                            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base 
                            text-white outline-1 -outline-offset-1 outline-white/10 
                            placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 
                            focus:outline-zinc-500 sm:text-sm/6"
                            placeholder="Enter your password"
                        />
                    </div>
                </div>

                <div>
                    <button 
                        type="submit" 
                        className="mt-6 flex w-full justify-center rounded-md bg-zinc-700 px-3 py-1.5 
                        text-sm/6 font-semibold text-white hover:bg-zinc-600 
                        focus-visible:outline-2 focus-visible:outline-offset-2 
                        focus-visible:outline-zinc-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!email || !password || !!emailError}
                    >
                        Sign in
                    </button>
                </div>

            </form>

            <p className="mt-4 text-center text-sm/6 text-gray-100">
                Not Register yet?  <NavLink to="/signup"  className="font-semibold text-zinc-400 hover:text-zinc-200">
                    Register
                </NavLink>
            </p>

            <div className=''>
                <div className="text-gray-300 flex justify-center items-center mt-2 w-full max-w-md mx-auto px-4 space-x-4">
                    <div className="flex-grow border-2 rounded-2xl"></div>
                    <p className="sm:text-[16px] text-sm whitespace-nowrap">Or continue with</p>
                    <div className="flex-grow border-2 rounded-2xl"></div>
                </div>

                <div className='flex flex-col sm:flex-row items-center justify-center gap-4 mt-4'>
                    <button 
                        type="button" 
                        className="flex w-full justify-center items-center gap-1 rounded-md bg-zinc-700 px-3 py-1.5 
                        text-sm/6 font-semibold text-white hover:bg-zinc-600 
                        focus-visible:outline-2 focus-visible:outline-offset-2 
                        focus-visible:outline-zinc-500 hover:scale-110 cursor-pointer"
                        onClick={handleGoogleLogin}
                    >
                        <GoogleIcon fontSize='small'/>Google
                    </button>
                    <button 
                        type="button" 
                        className="flex w-full justify-center items-center gap-1 rounded-md bg-zinc-700 px-3 py-1.5 
                        text-sm/6 font-semibold text-white hover:bg-zinc-600 
                        focus-visible:outline-2 focus-visible:outline-offset-2 
                        focus-visible:outline-zinc-500 hover:scale-110 cursor-pointer"
                        onClick={handleGitHubLogin}
                    >
                        <GitHubIcon /> Github
                    </button>
                </div>
            </div>

        </div>

    </div>
  )
}

export default Login