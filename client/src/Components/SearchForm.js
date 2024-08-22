import React, {useState} from 'react';
import { Box, Button, Input } from "@chakra-ui/react";
import axios from 'axios';
import { HiPencilAlt } from "react-icons/hi";
import { FaDatabase } from "react-icons/fa";

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
                <Box className='vc-form'>
                    <div className='vc-options'>
                        <button onClick ={()=> {setShowInputForm(true); setShowDBForm(false); setVCInput(true);}} ><HiPencilAlt className='vc-icon'/><span>Custom Input</span></button>
                        <button onClick = {() => {setShowDBForm(true); setShowInputForm(false); setVCInput(false)}}><FaDatabase className='vc-icon'/><span>Get Q item from database</span></button>
                    </div>
                    
                    <button className= 'vc-cancel' onClick = {() => onAssign('cancelled', itemType)}>Cancel</button>
                </Box>
            )}

            {showInputForm && (
                <Box className='vc-input-form'>
                    <Input
                        placeholder='Enter custom value constraint...' value={userInput} onChange={handleInput} mb={2} className='vc-input'
                    ></Input>
                    <div className='buttons'>
                        <button onClick={()=>onAssign(userInput, itemType)}>Submit</button>
                        <button onClick = {() => setShowInputForm(false)}>Cancel</button>
                    </div>
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
                    <button className= 'cancelSearch' onClick = {() => onAssign('cancelled', itemType)}>Cancel</button>
                </Box>
            )}
            
        </>
    );
}

