import React, {useEffect, useState} from "react";
import axios from "axios";
import { Box } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";

export const ConstructorForm = ({setConstructorForm, setAddedNodes, setAddedEdges}) =>{

    const [searchTerm, setSearchTerm] = useState('');
    const [constructors, setConstructors] = useState([]);

    useEffect(() =>{
        //fetch items based on item type
        axios.post('http://localhost:3001/getAllConstructors').then((response) =>{
            setConstructors(response.data);
            console.log(response.data);
            // console.log(response.data);
        }).catch(error=>{
            console.error("Error getting items."+error);
        })
    },[])

    //handle search input change
    const handleSearch = (e) =>{
        setSearchTerm(e.target.value);
    }

    //filter items based on search term
    const filteredItems = constructors.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()));


    const handleConstructorSelected = (edges, nodes) =>{
        const parsedEdges = JSON.parse(edges || '[]');
        const parsedNodes = JSON.parse(nodes || '[]');
        setAddedEdges(parsedEdges);
        setAddedNodes(parsedNodes);
        setConstructorForm(false);
    }

    return(
        <Box className="search-form">
            <Input placeholder='Search...' value={searchTerm} onChange={handleSearch} mb={2} className='search-input'/>
            <ul>
                {filteredItems.map(item=>(
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
        </Box>
        
    )
}