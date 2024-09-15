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
    const [confirmForm, setConfirmForm] = useState(false);
    const [conID, setConID] = useState(0);
    const [saveButtonClicked, setSaveButtonClicked] = useState(false);
    const [saveError, setSaveError] = useState('');

    useEffect(() =>{
        axios.post('http://localhost:3001/getCollections').then((response) =>{
            setCollections(response.data);
        }).catch(error=>{
            console.error("Error getting items."+error);
        })
    }, []);

    useEffect(() => {
        if (!errorMessage && textGenerated && saveButtonClicked && nodeLabels.length > 0 && nodeLabels[0].length > 0) {
            checkForExistingConstructor();
        } else {
            setSaveForm(false);
        }
    }, [textGenerated, nodeLabels, setSaveForm]);

    const handleSave = async () =>{
        setSaveMessage(""); // Reset save message
        setSaveError('');
        if(!nodes.length>0){
            setSaveMessage("Constructor is empty.");
            return;
        }
        setSaveButtonClicked(true);
        setIsGenerating(true);
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

    const checkForExistingConstructor = async () =>{
        let maxConID= -1;

        nodes.forEach(node =>{
            if(node.data.conID>maxConID){
                maxConID=node.data.conID;
            }
        })

        setConID(maxConID);

        try{
            const response = await axios.post('http://localhost:3001/findConstructor', {nodes, edges, maxConID, userID});
            if (response.data === "Constructor found, not modified.") {
                setSaveMessage("Constructor has not been modified.");
                setSaveButtonClicked(false);
            }else if(response.data === "Constructor found, modified."){
                setConfirmForm(true);
            }else if (response.data === "Constructor not created by user."){
                setSaveMessage("Cannot modify constructors made by other users.")
                setSaveButtonClicked(false);
            }else if(response.data === "Constructor does not exist."){
                console.log("Constructor does not exist.");
                setSaveForm(true);
            }
        } catch (error){
            console.error("Error getting items: ", error);
            throw error;
        }
    }

    const handleFormSubmit = async (event) =>{
        event.preventDefault();
        if(conName === ''){
            setSaveError("Name the constructor.");
        }
        else if(description === ''){
            setSaveError("Enter a description.");
        }
        else{
            await saveConstructor();
        }
        
    }

    const saveConstructor = async() =>{
        setSaveForm(false);
        if(nodeLabels.length > 0 && nodeLabels[0].length > 0){
                try{
                    const response = await sendConstructorToDB(nodeLabels[0]);
                    if (response === "Constructor added." || response === "Constructor and new collection added."){
                        setConstructorAdded(true);
                        setSaveButtonClicked(false);
                    }
                    else{
                        setSaveMessage(response);
                        setSaveButtonClicked(false);
                    }
                }catch(error){
                    console.error("Error saving constructor:", error);
                    setSaveMessage("Error saving constructor.");
                } 
            }
            else{
                setSaveMessage("Constructor is empty.");
                setSaveButtonClicked(false);
            }
    }
    
    const sendConstructorToDB = async(string) =>{
        
        setConfirmForm(false);
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

    const handleCollectionChange = (event) =>{
        setConCollection(event.target.value)
    }

    const handleNewCollection = () =>{
        setNewCollectionForm(true);
        setSaveForm(false);
    }

    const handleCollectionAdded = (newCollection) =>{
        if(newCollection.length>0){
            const updatedCollections = [...collections, { name: newCollection, idcollections: newCollection }];
            setCollections(updatedCollections);
            setConCollection(newCollection);
            setNewCollectionForm(false);
            setSaveForm(true);
            setNewCollection('');
        }
        else{
            setSaveError("Name the collection.");
        }
    }

    const handleCancel = () =>{
        setSaveForm(false);
        setSaveButtonClicked(false);
    }

    return(
        <div>
            <Button onClick={() => handleSave()} className='ConstructorSaver'>
            Save Constructor
            </Button>

            {saveForm && (
                <Box className="SaveConstructorBox box-common">
                    <h1>Enter Constructor details</h1>
                    {saveError !== '' && !newCollectionForm &&(
                        <div className="save-error">
                            <p>{saveError}</p>
                        </div>
                    )}
                    
                    <input 
                        className="save-input"
                        placeholder="Name the constructor..." 
                        value={conName}
                        onChange={(e) => setConName(e.target.value)}
                    ></input>

                    <p>Choose a collection:</p>
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

                    <p>Enter a description:</p>
                    <textarea
                        className="description-input"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="3"
                        cols="30"
                    ></textarea>
                    
                    <div>
                        <Button className="saveForm-button" type="submit" onClick={handleFormSubmit}>Confirm details</Button>
                        <Button className="saveForm-button" onClick={()=>handleCancel()}>Cancel</Button>
                    </div>
                    
                </Box>
            )}

            {newCollectionForm &&(
                <Box className="NewCollectionBox box-common">
                    {saveError ==='Name the collection.' &&(
                        <div className="save-error">
                            <p>{saveError}</p>
                        </div>
                    )}
                    
                    <Input
                        className="save-input"
                        placeholder="Name the collection..." 
                        value={newCollection}
                        onChange={(e) => setNewCollection(e.target.value)}
                    ></Input>

                    <div>
                        <Button className="saveForm-button" onClick={() => handleCollectionAdded(newCollection)}>Save</Button>
                        <Button className="saveForm-button" onClick = {() => {setNewCollectionForm(false); setSaveForm(true); setSaveError('');}}>Cancel</Button>
                    </div>
                    
                </Box>
            )}

            {confirmForm && (
                <Box className = 'ConfirmSaveConstructorBox box-common'>
                    <p>Are you sure you want to save changes to constructor {conID}?</p>
                    <button onClick={()=> saveConstructor()}>Confirm</button>
                </Box>
            )}
        </div>
    )
}