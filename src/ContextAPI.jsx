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

import { 
    getFirestore, 
    collection,
    addDoc,
    query, 
    where, 
    getDocs,
    onSnapshot,
    doc,
    orderBy,
    updateDoc,
    deleteDoc,
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export const ContextAPI = createContext({
    todos: [],
    addTodo: (todo) => {},
    updateTodo: (id, todo) => {},
    deleteTodo: (id) => {},
    toggleComplete: (id) => {},
});

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

// Initialize Cloud Firestore and get a reference to the service
const firebaseDB = getFirestore(firebaseApp);

export const  ContextProvider = ({children}) => {

    const [theme, setTheme] = useState(localStorage.getItem('theme') ? 
        localStorage.getItem('theme') : 'light');

    const toggleTheme = (newTheme) => {
        setTheme(newTheme);
        try {
            localStorage.setItem('theme', newTheme);
        } catch (error) {
            console.log("Error saving theme to localStorage:", error);
        }
    };

    // Track the User make State and useEffect And onAUthStateChanged check the current user
    const [user,setUser] = useState(null)

    const [todos,setTodos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredTodos, setFilteredTodos] = useState([]);
    

    const isLoggedIn = user ? true : false
    
    //console.log("User State : ", user);

    useEffect(() => {
         const unsubscribeAuth = onAuthStateChanged(firebaseAuth, (currentUser) => {
            //console.log("Auth State Changed : ", currentUser);
            
            if(currentUser){
                setUser(currentUser);
                // Call fetchTodos when user logs in
                fetchTodos(currentUser.uid)
            }else {
                setUser(null)
                setTodos([])   // Clear todos when user logs out
            }

        })

        // Cleanup function
        return () => unsubscribeAuth();
    
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

    // Function for add data in the firebase store
    async function addTodo (todoData){
        if(!user){
            alert('User must be logged in to add todos')
            return
        }

        try {
            
            const newTodo = {
                todo: todoData.todo,
                completed: false,
                userId: user.uid,
                createdAt: new Date(),
                updateAt: new Date()   // Fixed typo: was 'updateAt'
            }
            
            const docRef = await addDoc(collection(firebaseDB,"todos"), newTodo);
            //console.log("Add Data With ID : ", docRef.id)
            return docRef.id;

        } catch (error) {
            console.error("Error adding todo:", error);
            throw error;
        }
    }

    // Function for fetching todos 
    async function fetchTodos(userID) {

        if(!userID) return

        setLoading(true);

        try {

            const collectionRef = collection(firebaseDB,"todos");
            const q = query(collectionRef, where("userId", '==', userID), orderBy("createdAt", "desc") ) 
            // const result = await getDocs(q);
            // console.log(result);

            //Real-time listener for todos
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                
                const todosData = []
                
                querySnapshot.forEach((doc) => {
                    todosData.push({
                        id: doc.id,
                        ...doc.data()
                    })
                })
            
                setTodos(todosData)
                setLoading(false);
            
            })

            return unsubscribe;      // Return unsubscribe function for cleanup

        } catch (error) {
            console.error("Error in todos snapshot context:", error);
            setLoading(false);
        }
    }

    // Function for Update todo
    async function updateTodo(id, updatedData) {
        try {
            const todoRef = doc(firebaseDB,'todos', id)
            await updateDoc(todoRef, {
                ...updatedData,
                updateAt: new Date()
            })
            console.log("Todo updated successfully")
        }catch(error){
            console.error('Error updating todo:', error)
            throw error
        }
    }

    // Function for Delete Todo
    async function deleteTodo(id) {
        try {
            await deleteDoc(doc(firebaseDB, 'todos', id))
            console.log("Todo deleted successfully");
        } catch (error) {
            console.error('Error deleting todo:', error)
            throw error
        }
    }

    // Function for complete toggle
    async function toggleComplete(id) {
        try {
            const todo = todos.find((t) => (t.id === id))
            if(todo) {
                const todoRef = doc(firebaseDB, "todos",id);
                await updateDoc(todoRef, {
                    completed: !todo.completed,
                    updateAt: new Date()
                })
            }
        } catch (error) {
            console.error("Error toggling todo",error)
            throw error
        }
    }

    // Function for search 
    async function searchTodos(searchText){
    
        if(!user || !searchText.trim()){
            setFilteredTodos([])
            return
        }

        try {
     
            setLoading(true)
     
            const todoRef = collection(firebaseDB, "todos")
            const q = query(todoRef, where("userId", '==', user.uid))
            
            const querySnapshot = await getDocs(q);

            const searchResults = []

            querySnapshot.forEach((doc) => {
                const todoData = {
                    id: doc.id,
                    ...doc.data()
                }
                // Client-side filtering for substring search
                if (todoData.todo.toLowerCase().includes(searchText.toLowerCase())) {
                    searchResults.push(todoData)
                }
            })

            setFilteredTodos(searchResults)

        } catch (error) {
            console.error("Error searching todos:", error);
            setFilteredTodos([]);
        } finally {
            setLoading(false);
        }
    }

    // Add clear search function
    const clearSearch = () => {
        setSearchTerm('');
        setFilteredTodos([]);
    };

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
          todos,
          addTodo,
          fetchTodos,
          loading,
          updateTodo,
          deleteTodo,
          toggleComplete,
          searchTerm,
          setSearchTerm,
          searchTodos,
          filteredTodos,
          clearSearch,
        }}>
            {children}
        </ContextAPI.Provider>
    )
}
