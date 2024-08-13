import React, { useContext } from "react";
import { UserContext } from "../Contexts/UserContext";

export const LogOut = () =>{

    const {setUserID} = useContext(UserContext);
    
    const handleLogout = () =>{
        setUserID(null);
        Navigate('/login');
    }
}