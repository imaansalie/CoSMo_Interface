import React, {useContext, useState, useEffect} from "react";
import axios from "axios";
import { UserContext } from "../Contexts/UserContext";
import { Button, Input } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";

export const ConstructorSaver = ({nodes, edges, nodeLabels, setConstructorAdded, errorMessage, setSaveMessage, saveForm, setSaveForm, textGeneratorRef}) =>{

    const {userID} = useContext(UserContext);
    const [conName, setConName] = useState('');
    const [conCollection, setConCollection] = useState('Collection1');
    const [description, setDescription] = useState('');
    const [collections, setCollections]= useState([]);
    const [newCollectionForm, setNewCollectionForm] = useState(false);
    const [newCollection, setNewCollection] = useState('');
    const [textGenerated, setTextGenerated] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() =>{
        axios.post('http://localhost:3001/getCollections').then((response) =>{
            setCollections(response.data);
        }).catch(error=>{
            console.error("Error getting items."+error);
        })
    }, []);

    useEffect(() => {
        if (!errorMessage && textGenerated && nodeLabels.length > 0 && nodeLabels[0].length > 0) {
            setSaveForm(true);
        } else {
            setSaveForm(false);
        }
    }, [textGenerated, nodeLabels, setSaveForm]);

    const handleSave = async () =>{
        setSaveMessage(""); // Reset save message
        setTextGenerated(false);
        try {
            await generateText_Save();
            setTextGenerated(true);
        } catch (error) {
            console.error("Error during text generation or handling save:", error);
            setSaveMessage("Error generating text or saving constructor.");
        } finally {
            setIsGenerating(false);
        }
    }

    const saveConstructor = async() =>{
        if(nodeLabels.length > 0 && nodeLabels[0].length > 0){
                try{
                    const response = await sendConstructorToDB(nodeLabels[0]);
                    if (response === "Constructor added." || response === "Constructor and new collection added."){
                        setConstructorAdded(true);
                    }
                    else{
                        setSaveMessage(response);
                    }
                }catch(error){
                    console.error("Error saving constructor:", error);
                    setSaveMessage("Error saving constructor.");
                } 
            }
            else{
                setSaveMessage("Constructor is empty.");
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
            const response = await axios.post('http://localhost:3001/saveConstructor', {maxConID, nodes, edges, conName, conCollection, string, description, userID});
            console.log(response.data)
            return response.data;
        } catch (error){
            console.error("Error getting items: ", error);
            throw error;
        }
    }

    const generateText_Save = async() =>{
        try {
            await textGeneratorRef.current.generateText();
        } catch (error) {
            console.error("Error generating text:", error);
            setSaveMessage("Text generation failed.");
            throw error;
        }
    }

    const handleFormSubmit = async (event) =>{
        event.preventDefault();
        await saveConstructor();
    }

    const handleCollectionChange = (event) =>{
        setConCollection(event.target.value)
    }

    const handleNewCollection = () =>{
        setNewCollectionForm(true);
        setSaveForm(false);
    }

    const handleCollectionAdded = (newCollection) =>{
        const updatedCollections = [...collections, { name: newCollection, idcollections: newCollection }];
        setCollections(updatedCollections);
        setConCollection(newCollection);
        setNewCollectionForm(false);
        setSaveForm(true);
        setNewCollection('');
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
                        onChange={handleCollectionChange}
                    >
                        {collections.map((collection) =>(
                            <option key={collection.idcollections} value = {collection.name}>
                                {collection.name}
                            </option>
                        ))}
                    </select>

                    <Button className="saveForm-button" onClick={() => handleNewCollection()}>Add a new collection</Button>

                    <textarea
                        className="description-input"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="3"
                        cols="30"
                    ></textarea>
                    
                    <div>
                        <Button className="saveForm-button" type="submit" onClick={handleFormSubmit}>Confirm details</Button>
                        <Button className="saveForm-button" onClick={()=>setSaveForm(false)}>Cancel</Button>
                    </div>
                    
                </Box>
            )}

            {newCollectionForm &&(
                <Box className="SaveConstructorBox" style ={{margin: 'auto', justifyContent: 'center', maxHeight:'30%'}}>
                    <Input
                        className="save-input"
                        placeholder="Name the collection..." 
                        value={newCollection}
                        onChange={(e) => setNewCollection(e.target.value)}
                    ></Input>

                    <div>
                        <Button className="saveForm-button" onClick={() => handleCollectionAdded(newCollection)}>Save</Button>
                        <Button className="saveForm-button" onClick = {() => {setNewCollectionForm(false); setSaveForm(true)}}>Cancel</Button>
                    </div>
                    
                </Box>
            )}
        </div>
    )
}