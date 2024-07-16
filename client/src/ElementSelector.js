import React from 'react';
import {Menu, MenuButton, MenuList, MenuItem, Button, position} from "@chakra-ui/react";
import {ChevronBarDown} from "react-bootstrap-icons";
import { useReactFlow } from 'reactflow';

const elements =[
    {code:"Ob", name:"Object"},
    {code:"Func", name:"Function"},
];

const ElementSector= () =>{

    const {setNodes} =useReactFlow();
    const generateUniqueId = () => `node_${Math.random().toString(36).substr(2, 9)}`;

    const onProviderClick = ({name}) => {

        const x= Math.random() * 100;
        const y= Math.random() * 100;

        setNodes( (prevNodes) => [
            ...prevNodes, 
            {
                id: generateUniqueId(), 
                data: {label:name }, 
                type: `${name}`,
                position: {x:x, y:y},
            },
        ]);     
        
        console.log(`Added node: ${name} with ID ${generateUniqueId}`);
    };

    
    

    return(
        <Menu>
            <MenuButton as={Button} rightIcon={<ChevronBarDown/>}>
                Add Element
            </MenuButton>
            <MenuList>
                {elements.map( (element)=> (
                    <MenuItem onClick={() => onProviderClick(element)}>
                        {element.name}
                    </MenuItem>
                ))}
            </MenuList>
        </Menu>
    );
};

export default ElementSector;