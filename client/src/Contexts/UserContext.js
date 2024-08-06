import React, {createContext, useState} from "react";

export const UserContext = createContext();

export const UserProvider = ({children}) =>{
    const [userID, setUserID] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return(
        <UserContext.Provider value ={{userID, setUserID, password, setPassword, username, setUsername}}>
            {children}
        </UserContext.Provider>
    )
}