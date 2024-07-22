import React from 'react';
import {Menu, MenuButton, MenuList, MenuItem, Button, position} from "@chakra-ui/react";
import {ChevronBarDown} from "react-bootstrap-icons";
import { useReactFlow } from 'reactflow';

const elements =[
    {code:"Ob", name:"Object"},
    {code:"Func", name:"Function"},
    {code:"Arg", name:"Arguments"},
    {code:"InstCo", name:"InstanceConstructor"},
    {code:"Man", name:"IsMandatory"},
    {code:"Join", name:"Join"},
    {code:"Prop", name:"Property"},
    {code:"RN", name:"Role_name"},
    {code:"TC1", name:"TypeConstructor"},
    {code:"VC", name:"ValueConstraint"},
];

const ElementSelector= () =>{

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
            <MenuButton as={Button} rightIcon={<ChevronBarDown/>} className='Element-Dropdown'>
                Add Element
            </MenuButton>
            <MenuList>
                {elements.map( (element)=> (
                    <MenuItem onClick={() => onProviderClick(element)}>
                       <div><img src={"/icons/"+element.name+".png"} className='selector-img'/></div>
                       {element.name}
                    </MenuItem>
                ))}
            </MenuList>
        </Menu>
    );
};

export default ElementSelector;