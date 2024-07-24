import React, {useState} from 'react';
import { Box, Button, Input } from "@chakra-ui/react";
import axios from 'axios';

import { useEffect} from 'react';

export const SearchForm = ({onAssign, itemType}) =>{
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    // const [selectedItem, setSelectedItem] = useState(null);
    // const type= "items";

    useEffect(() =>{
        // setResults([{ id: 'item1', name: 'Item 1' }, { id: 'item2', name: 'Item 2' }]);
        axios.post('http://localhost:3001/getItems', {itemType}).then((response) =>{
            setResults(response.data);
            console.log(response.data);
        }).catch(error=>{
            console.error("Error getting items."+error);
        })
    },[itemType]);

    const handleSearch = (e) =>{
        setSearchTerm(e.target.value);
    }

    const filteredItems = results.filter(item => item.label.toLowerCase().includes(searchTerm.toLowerCase()));

    return(
        <Box
            position="fixed"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            border="1px solid gray"
            p={4}
            mt={4}
            zIndex={1000}
            bg="white"
        >
            <Input placeholder='Search...' value={searchTerm} onChange={handleSearch} mb={2}/>
            <ul>
                {filteredItems.map(item=>(
                    <li key={item.id}>
                        <Button onClick={()=> onAssign(item)}>{item.label}</Button>
                    </li>
                ))}
            </ul>
        </Box>
    );
}

