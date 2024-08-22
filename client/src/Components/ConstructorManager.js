import React, { useContext, useState, useEffect, useRef} from "react";
import { UserContext } from "../Contexts/UserContext";
import axios from "axios";
import { Button, Box} from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import { FaEllipsisH, FaEllipsisV } from "react-icons/fa";

export const ConstructorManager = ({addedNodes, addedEdges, setAddedNodes, setAddedEdges}) =>{

    const {username, userID} = useContext(UserContext);
    const [constructors, setConstructors] = useState({});
    const [deletedMessage, setDeletedMessage] = useState('');
    const [confirmationForm, setConfirmationForm] = useState(false);
    const [selectedConID, setSelectedConID] = useState(null);
    const [menuVisible, setMenuVisible] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() =>{
        const getConstructors = async() =>{
            if(userID){
                try{
                    const response = await axios.post('http://localhost:3001/getConstructors', {userID});
                    const data = response.data;

                    console.log(response.data);

                    //sorting constructors into groups
                    const groupedConstructors = data.reduce((acc, constructor) =>{
                        const collection = constructor.collection;
                        if(!acc[collection]){
                            acc[collection] = [];
                        }
                        acc[collection].push(constructor);
                        return acc;
                    }, {});
                    setConstructors(groupedConstructors);

                } catch (error){
                    console.error("Error getting items: ", error);
                    throw error;
                }
            }
        };

        getConstructors();
    }, [userID, deletedMessage]);

    const handleConstructorClick = (nodes, edges) =>{
        const parsedEdges = JSON.parse(edges || '[]');
        const parsedNodes = JSON.parse(nodes || '[]');
        setAddedEdges(parsedEdges);
        setAddedNodes(parsedNodes);
        navigate('/ConstructorBuilder', {state: {parsedNodes, parsedEdges}});
    }

    const handleDelete = async(conID) =>{
        setConfirmationForm(false);
        try{
            const response = await deleteConstructor(conID);
            if(response === "Constructor deleted."){
                setDeletedMessage(`Constructor C${conID} deleted.`);
            }
            else{
                setDeletedMessage(`Constructor C${conID} not found.`);
            }
        }catch (error){
            console.error("Error deleting constructor: ", error);
            throw error;
        }
    }

    const deleteConstructor = async(conID) =>{
        try{
            const response = await axios.post('http://localhost:3001/deleteConstructor', {conID});
            return response.data;
        } catch (error){
            console.error("Error getting items: ", error);
            throw error;
        }
    }

    const handleEllipsisClick = (conID) => {
        setSelectedConID(conID);
        setMenuVisible(true);
    };

    const handleClickOutside = (e) => {
        if (menuRef.current && !menuRef.current.contains(e.target)) {
            setMenuVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return(
        <div className="ConstructorManager">
            <div>
                <h1>My Constructors</h1>
            </div>
            <div className="MyConstructor-Box">
                {Object.entries(constructors).map(([collectionName, collectionConstructors]) => (
                    <div key={collectionName} className="constructor-collection">
                        <h2>{collectionName}</h2>
                        <ul className="MyConstructorList">
                            {collectionConstructors.map((constructor) => (
                            <li key={constructor.idconstructors} className="my-constructors">
                                <Button className= "MyConstructorButton"onClick={() =>handleConstructorClick(constructor.nodes, constructor.edges)}>
                                    <h3>{constructor.name}</h3>
                                    <p>{constructor.description}</p>
                                </Button>
                                <div className="ellipsis-menu">
                                    <FaEllipsisH
                                        className="ellipsis-icon"
                                        onClick={() => handleEllipsisClick(constructor.idconstructors)}
                                    />
                                    {menuVisible && selectedConID === constructor.idconstructors && (
                                        <div ref={menuRef} className="menu">
                                            <p onClick={() => setConfirmationForm(true)}>
                                                Delete
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </li>
                            ))}
                        </ul>
                    </div>
                ))}
                {Object.keys(constructors).length===0 && (
                    <p style ={{marginTop: '200px', marginLeft:'350px'}}>Your saved constructors will appear here.</p>
                )}

                {deletedMessage !== '' && (
                    <Box className="DeleteBox">
                        <p>{deletedMessage}</p>
                        <button onClick={() => setDeletedMessage('')}>Okay</button>
                    </Box>
                )}

                {confirmationForm && (
                    <Box className="DeleteBox">
                        <p>Are you sure you would like to delete the constructor: C{selectedConID}? </p>
                        <div>
                            <button onClick={() => handleDelete(selectedConID)}>Confirm</button>
                            <button onClick={() => setConfirmationForm(false)}>Cancel</button>
                        </div>
                        
                    </Box>
                )}
            </div>
        </div>
    )
}