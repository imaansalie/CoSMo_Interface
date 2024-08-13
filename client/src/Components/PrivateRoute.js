import React, {useContext} from 'react';
import { Route, Navigate } from 'react-router-dom';
import { UserContext } from '../Contexts/UserContext';

const PrivateRoute = ({children}) =>{
    const {isAuthenticated} = useContext(UserContext);

    return isAuthenticated? children: <Navigate to="/"/>
};

export default PrivateRoute;