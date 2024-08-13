import React, {createContext, useState} from "react";

export const UserContext = createContext();

export const UserProvider = ({children}) =>{
    const [userID, setUserID] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

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