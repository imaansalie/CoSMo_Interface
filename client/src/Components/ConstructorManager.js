import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../Contexts/UserContext";
import axios from "axios";
import { Button } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';

export const ConstructorManager = ({addedNodes, addedEdges, setAddedNodes, setAddedEdges}) =>{

    const {username, userID} = useContext(UserContext);
    const [constructors, setConstructors] = useState({});
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
    }, [userID]);

    const handleConstructorClick = (nodes, edges) =>{
        const parsedEdges = JSON.parse(edges || '[]');
        const parsedNodes = JSON.parse(nodes || '[]');
        setAddedEdges(parsedEdges);
        setAddedNodes(parsedNodes);
        navigate('/ConstructorBuilder', {state: {parsedNodes, parsedEdges}});
    }
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
                            </li>
                            ))}
                        </ul>
                    </div>
                ))}
                {Object.keys(constructors).length===0 && (
                    <p style ={{marginTop: '200px', marginLeft:'350px'}}>Your saved constructors will appear here.</p>
                )}
            </div>
        </div>
    )
}