import React, {useState} from 'react';
import { Box, Button, Input } from "@chakra-ui/react";
import axios from 'axios';

import { useEffect} from 'react';

export const SearchForm = ({onAssign, itemType, setVCInput}) =>{
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [userInput, setUserInput]= useState('');
    const [showInputForm, setShowInputForm] = useState(false);
    const [showDBForm, setShowDBForm]= useState(false);
    const [showChoice, setShowChoice] = useState(false);

    useEffect(() =>{
        //fetch items based on item type
        axios.post('http://localhost:3001/getItems', {itemType}).then((response) =>{
            setResults(response.data);
            // console.log(response.data);
        }).catch(error=>{
            console.error("Error getting items."+error);
        })
    },[itemType]);

    useEffect(()=>{
        if(itemType === 'ValueConstraint'){
           setShowChoice(true);
        }
        else{
            setShowChoice(false);
            setShowInputForm(false);
            setShowDBForm(true);
        }
    }, [itemType])

    //handle search input change
    const handleSearch = (e) =>{
        setSearchTerm(e.target.value);
    }

    //filter items based on search term
    const filteredItems = results.filter(item => 
        item.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleInput = (e) =>{
        setUserInput(e.target.value);
    }
    
    return(
        <>
            {showChoice && !showInputForm && !showDBForm &&(
                <Box className='search-form'>
                    <Button onClick ={()=> {setShowInputForm(true); setShowDBForm(false); setVCInput(true);}} >Custom Input</Button>
                    <Button onClick = {() => {setShowDBForm(true); setShowInputForm(false); setVCInput(false)}}>Get Q item from database</Button>
                    <button onClick = {() => onAssign('cancelled', itemType)}>Cancel</button>
                </Box>
            )}

            {showInputForm && (
                <Box className='search-form'>
                    <Input
                        placeholder='Enter custom value constraint...' value={userInput} onChange={handleInput} mb={2} className='search-input'
                    ></Input>
                    <Button onClick={()=>onAssign(userInput, itemType)}>Submit</Button>
                </Box>
            )}

            {showDBForm &&(
                <Box className='search-form'>
                    <Input placeholder='Search...' value={searchTerm} onChange={handleSearch} mb={2} className='search-input'/>
                    <div className='search-form-list'>
                        <ul>
                            {filteredItems.map(item=>(
                                <li key={item.itemID}>
                                    <Button className='button' onClick={()=> onAssign(item, itemType)}>
                                        <div className='itemLabel'>
                                            {item.label}
                                        </div>
                                        <div className='description'>
                                            {item.description}
                                        </div>
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <button onClick = {() => onAssign('cancelled', itemType)}>Cancel</button>
                </Box>
            )}
            
        </>
    );
}

