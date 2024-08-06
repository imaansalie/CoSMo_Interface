import React, {useContext} from "react";
import axios from "axios";
import { UserContext } from "./Contexts/UserContext";

export const ConstructorSaver = ({nodeLabels, setConstructorAdded, setErrorMessage}) =>{

    const {userID} = useContext(UserContext);

    const saveConstructor = async() =>{

        console.log(userID);

        if(nodeLabels.length>0){
          if(nodeLabels[0].length>0){
            const response = await sendConstructorToDB(nodeLabels[0]);
            console.log(response);
            if (response === "Constructor added."){
              setConstructorAdded(true);
            }
          }
          else{
            setErrorMessage("Constructor is empty, generate text before saving.");
          }
        }else{
          setErrorMessage("Constructor is empty, generate text before saving.");
        }
      }
    
      const sendConstructorToDB = async(string) =>{
        try{
          const response = await axios.post('http://localhost:3001/saveConstructor', {userID, string});
          console.log(response.data)
          return response.data;
        } catch (error){
            console.error("Error getting items: ", error);
            throw error;
        }
      }

    return(
        <div onClick={() => saveConstructor()} className='ConstructorSaver'>
            Save Constructor
        </div>
    )
}