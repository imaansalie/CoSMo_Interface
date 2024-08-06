import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "./Contexts/UserContext";
import axios from "axios";

export const ConstructorManager = () =>{

    const {username, userID} = useContext(UserContext);
    const [constructors, setConstructors] = useState([]);

    useEffect(() =>{
        const getConstructors = async() =>{
            if(userID){
                try{
                    const response = await axios.post('http://localhost:3001/getConstructors', {userID});
                    console.log(response.data)
                    setConstructors(response.data);
                    return response.data;
                } catch (error){
                    console.error("Error getting items: ", error);
                    throw error;
                }
            }
        };

        getConstructors();
    }, [userID]);

    
    return(
        <div>
            <ul>
                {constructors.map((constructor) => (
                    <li key={constructor.conID}>
                        <h2>Constructor ID: {constructor.conID}</h2>
                        <div dangerouslySetInnerHTML={{ __html: constructor.output }} />
                    </li>
                ))}
            </ul>
        </div>
    )
}