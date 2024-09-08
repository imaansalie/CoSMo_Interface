import React, {createContext, useState, useEffect} from "react";

export const UserContext = createContext();

export const UserProvider = ({children}) =>{
    const [userID, setUserID] = useState(localStorage.getItem('userID') || '');
    const [username, setUsername] = useState(localStorage.getItem('username') || '');
    const [password, setPassword] = useState('');

    useEffect(() => {
        // Store user data in localStorage whenever it changes
        if (userID) {
            localStorage.setItem('userID', userID);
            localStorage.setItem('username', username);
        } else {
            localStorage.removeItem('userID');
            localStorage.removeItem('username');
        }
    }, [userID, username]);

    const value = {
        username,
        setUsername,
        password,
        setPassword,
        userID,
        setUserID,
        isAuthenticated: !!userID,
    }

    return(
        <UserContext.Provider value ={value}>
            {children}
        </UserContext.Provider>
    )
}