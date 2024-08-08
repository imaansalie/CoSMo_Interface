import React, {useContext, useState} from "react";
import axios from "axios";
import { UserContext } from "./Contexts/UserContext";
import { Button } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";

//will dynamically get collections later 
const collections = [
    {code: 'CO1', name: 'Collection1'},
    {code: 'CO2', name: 'Collection2'},
    {code: 'CO3', name: 'Collection3'}
]

export const ConstructorSaver = ({nodes, edges, nodeLabels, setConstructorAdded, setErrorMessage, saveForm, setSaveForm}) =>{

    const {userID} = useContext(UserContext);
    const [conName, setConName] = useState('');
    const [conCollection, setConCollection] = useState('Collection1');
    const [description, setDescription] = useState('');
    // const [max, setMax] = useState(-1);
    // const {collections, setCollections}= useState([]);

    const handleSave = () =>{
        setSaveForm(true);
        // console.log(userID);
    }

    const saveConstructor = async() =>{
        if(nodeLabels.length>0){
            if(nodeLabels[0].length>0){
              const string = nodeLabels[0];
              console.log(conName);
              console.log(conCollection);
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
        
        let maxConID= -1;

        nodes.forEach(node =>{
            if(node.data.conID>maxConID){
                maxConID=node.data.conID;
            }
        })

        try{
            const response = await axios.post('http://localhost:3001/saveConstructor', {maxConID, nodes, edges, conName, conCollection, string, description});
            console.log(response.data)
            return response.data;
        } catch (error){
            console.error("Error getting items: ", error);
            throw error;
        }
    }

    const handleFormSubmit = (event) =>{
        event.preventDefault();
        setSaveForm(false);
        saveConstructor();
        // console.log(conName);
        // console.log(conCollection);
    }

    const handleCollectionSubmit = (event) =>{
        const newCollection = event.target.value;
        setConCollection(newCollection);
        // console.log(conCollection);
    }

    return(
        <div>
            
            <Button onClick={() => handleSave()} className='ConstructorSaver'>
            Save Constructor
            </Button>

            {saveForm && (
                <Box className="SaveConstructorBox">
                    <h1>Enter Constructor details</h1>
                    <input 
                        className="save-input"
                        placeholder="Name the constructor..." 
                        value={conName}
                        onChange={(e) => setConName(e.target.value)}
                    ></input>

                    <select
                        id="collections-dd"
                        value={conCollection}
                        onChange={handleCollectionSubmit}
                    >
                        {collections.map((collection) =>(
                            <option key={collection.code} value = {collection.name}>
                                {collection.name}
                            </option>
                        ))}
                    </select>

                    <textarea
                        className="description-input"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="3"
                        cols="30"
                    ></textarea>
                    
                    <Button className="saveForm-button"
                    type="submit" onClick={handleFormSubmit}>Confirm details</Button>
                </Box>
            )}
        </div>
        

        
    )
}