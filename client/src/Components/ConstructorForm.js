import React, {useEffect, useState} from "react";
import axios from "axios";
import { Box } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";

export const ConstructorForm = ({setConstructorForm, setAddedNodes, setAddedEdges}) =>{

    const [searchTermCollection, setSearchTermCollection] = useState('');
    const [searchTermConstructor, setSearchTermConstructor] = useState('');
    const [constructors, setConstructors] = useState([]);
    const [collection, setCollection] = useState('');
    const [collections, setCollections] = useState([]);

    //get collections
    useEffect(() =>{
        axios.post('http://localhost:3001/getCollections').then((response) =>{
            setCollections(response.data);
        }).catch(error=>{
            console.error("Error getting items."+error);
        })
    }, []);

    //get constructors based on collection
    useEffect(() =>{
        if(collection !== ''){
            axios.post('http://localhost:3001/getAllConstructors', {collection}).then((response) =>{
                setConstructors(response.data);
            }).catch(error=>{
                console.error("Error getting items."+error);
            })
        }
        
    },[collection]);

    //handle search input change
    const handleCollectionSearch = (e) =>{
        setSearchTermCollection(e.target.value);
    }

    const handleConstructorSearch = (e) =>{
        setSearchTermConstructor(e.target.value);
    }

    //filter items based on search term
    const filteredCollections = collections.filter(item => 
        item.name.toLowerCase().includes(searchTermCollection.toLowerCase())
    );

    const filteredConstructors = constructors.filter(item => 
        item.name.toLowerCase().includes(searchTermConstructor.toLowerCase())
    );

    const handleConstructorSelected = (edges, nodes) =>{
        const parsedEdges = JSON.parse(edges || '[]');
        const parsedNodes = JSON.parse(nodes || '[]');
        setAddedEdges(parsedEdges);
        setAddedNodes(parsedNodes);
        setConstructorForm(false);
    }

    const handleCollectionSelected = (c)=>{
        setCollection(c);
        setSearchTermConstructor('');
    }

    return(
        <>
            {collection === '' && (
                <Box className = "constructorSearch search-form">
                <Input placeholder='Search...' value={searchTermCollection} onChange={handleCollectionSearch} mb={2} className='search-input'/>
                <ul>
                    {filteredCollections.map(item=>(
                        <li key={item.idcollections}>
                            <Button className='button' onClick ={()=> handleCollectionSelected(item.name)}>
                                <div className='itemLabel'>
                                    {item.name}
                                </div>
                            </Button>
                        </li>
                    ))}
                </ul>
                <button className= "addConstructorCancel" onClick={()=>setConstructorForm(false)}>Cancel</button>
            </Box>
            )}
            

            {collection !== '' &&(
                <Box className="constructorSearch search-form">
                <Input placeholder='Search...' value={searchTermConstructor} onChange={handleConstructorSearch} mb={2} className='search-input'/>
                <ul>
                    {filteredConstructors.map(item=>(
                        <li key={item.idconstructors}>
                            <Button className='button' onClick ={()=> handleConstructorSelected(item.edges, item.nodes)}>
                                <div className='itemLabel'>
                                    {item.name}
                                </div>
                                <div className='itemDescription'>
                                    {item.description}
                                </div>
                            </Button>
                        </li>
                    ))}
                </ul>
                <button className= "addConstructorCancel" onClick={()=>setConstructorForm(false)}>Cancel</button>
                </Box>
            )}
            
        </>
    )
}
