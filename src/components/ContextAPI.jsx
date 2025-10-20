import { useState, createContext, useContext, useEffect  } from 'react'
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// Import Authentication module
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    setPersistence, 
    browserSessionPersistence ,
    onAuthStateChanged,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    GithubAuthProvider,
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export const ContextAPI = createContext();

export const useContextAPI = () => useContext(ContextAPI);

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Instance of Authentication
const firebaseAuth = getAuth(firebaseApp);

// Set session persistence to session only (not local)
setPersistence(firebaseAuth, browserSessionPersistence)

// Instance of Google Authentication
const googleProvider = new GoogleAuthProvider();

// Instance of Github Authentication
const githubProvider = new GithubAuthProvider();

export const  ContextProvider = ({children}) => {

    const [theme, setTheme] = useState('light');

    const toggleTheme = (value) => {
        setTheme(value)
    }

    // Track the User make State and useEffect And onAUthStateChanged check the current user
    const [user,setUser] = useState(null)

    const isLoggedIn = user ? true : false
    
    //console.log("User State : ", user);

    useEffect(() => {
        onAuthStateChanged(firebaseAuth, (currentUser) => {
            //console.log("Auth State Changed : ", currentUser);
            
            if(currentUser){
                return setUser(currentUser);
            }else {
                return setUser(null)
            }

        })
    }, [])

    // Function to signup user with email and password
    async function signupUserWithEmailAndPassword(email,password){
        // Don't automatically sign in after signup
        return await createUserWithEmailAndPassword(firebaseAuth,email,password);
    }

    // Function to signin user with email and password
    async function signinUserWithEmailAndPassword(email,password){
        return await signInWithEmailAndPassword(firebaseAuth,email,password);
    }

    //Function to SignIN With Google
    const signinWithGoogle = async () => {
        return await signInWithPopup(firebaseAuth, googleProvider);
    }

    //Function to SignIN With Github
    const signinWithGithub = async () => {
        return await signInWithPopup(firebaseAuth, githubProvider);
    }

    //Function to Logout user
    async function logoutUser() {
        return await signOut(firebaseAuth);
    }

    return (
        <ContextAPI.Provider value = {{
          theme, 
          setTheme, 
          toggleTheme,
          signupUserWithEmailAndPassword,
          signinUserWithEmailAndPassword,
          signinWithGoogle,
          signinWithGithub,
          logoutUser,
          isLoggedIn,
          user,

        }}>
            {children}
        </ContextAPI.Provider>
    )
}
