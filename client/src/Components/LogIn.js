import React, {useContext, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../Contexts/UserContext';
import { Box } from '@chakra-ui/react';

export const LogIn = ({setIsNavbarVisible}) =>{

    const {username, setUsername, password, setPassword, setUserID} = useContext(UserContext);
    const [userError, setUserError] = useState('');
    const navigate = useNavigate();

    const handleUsername = (event) =>{
        setUsername(event.target.value);
    }

    const handlePassword = (event) =>{
        setPassword(event.target.value);
    }

    const handleLogin = async() =>{
        
        const userID = await getUserID(username, password);
        setUserID(userID);

        if (userID) {
            localStorage.setItem('userID', userID);  // Store in localStorage
            localStorage.setItem('username', username);  // Store in localStorage
            setIsNavbarVisible(true);
            navigate('/ConstructorManager');
        } else {
            setUserError(`User ${username} not found.`);
        }
    }

    const getUserID = async (username, password) =>{
        try{
            const response = await axios.post('http://localhost:3001/getUser', {username, password});
            if(response.data && response.data.length>0){
                console.log(response.data);
                return response.data[0].idusers;
            }else{
                console.error("User not found.");
                return null;
            }
            
        } catch (error){
             console.error("Error getting items: ", error);
             throw error;
        }
    }

    return(
        <div className='Login' style={{backgroundImage: 'url(./icons/background.jpg)'}}>
            <h1 className='Login-heading'>Welcome to CoSMo Studio</h1>
            <p className='Login-text'>Log in using your Wikipedia credentials</p>
            <div className='LoginBox'>
                <input 
                    placeholder='Enter username...' 
                    value = {username}
                    onChange={handleUsername}
                />

                <input 
                    placeholder='Enter password...' 
                    value = {password}
                    onChange={handlePassword}
                    type="password"
                />

                <button onClick={handleLogin}>Log in</button>
            </div>

            {userError !== '' && (
                <Box className='Login-error box-common'>
                    <p>{userError}</p>
                    <button className="login-error-button" onClick={() => setUserError('')}>Okay</button>
                </Box>
            )}
        </div>
    )
};
