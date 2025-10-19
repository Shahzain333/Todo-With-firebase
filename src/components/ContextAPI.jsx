import { useState, createContext, useContext  } from 'react'

export const ContextAPI = createContext();

export const useContextAPI = () => useContext(ContextAPI);


export const  ContextProvider = ({children}) => {

    const [theme, setTheme] = useState('light');

    const toggleTheme = (value) => {
        setTheme(value)
    }

    return (
        <ContextAPI.Provider value={{theme, setTheme, toggleTheme}}>
            {children}
        </ContextAPI.Provider>
    )
}
