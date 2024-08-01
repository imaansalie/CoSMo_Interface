import React, {useEffect, useState, useRef} from 'react';
import {Handle, Position, useReactFlow} from 'reactflow';
import { IconButton } from '@chakra-ui/react';
import {FiX} from 'react-icons/fi';

const InputNode = ({id, data, selected}) =>{
    // const [text, setText] = useState('');
    // const [isEditing, setIsEditing] = useState(true);
    const {setNodes} = useReactFlow();
    // const nodeRef = useRef(null);

    // const handleTextChange = (event) =>{
    //     setText(event.target.value);
    //     data.onChange(event.target.value);
    // }

    // const handleClickOutside = (event) =>{
    //     if(nodeRef.current && !nodeRef.current.contains(event.target)){
    //         setIsEditing(false);
    //     }
    // }

    // useEffect(() =>{
    //     document.addEventListener('mousedown', handleClickOutside);

    //     return () =>{
    //         document.removeEventListener('mousedown', handleClickOutside)
    //     }
    // }, []);

    const getDisplayText = () => {
        switch (data.inputType) {
            case 'Role_name':
                return `[${data.itemLabel} (${data.itemID})]`;
            case 'ValueConstraint':
                return `{${data.itemID}}`;
            default:
                return 'not in ';
        }
    };

    const getTextColor = () => {
        switch (data.inputType) {
            case 'Role_name':
                return 'rgb(10, 47, 139)';
            case 'ValueConstraint':
                return 'purple';
            default:
                return 'black';
        }
    };

    return(
        <div>
            {/* <Handle type="source" position={Position.Top} id="IN-top"/> */}
            <Handle type="target" position={Position.Left} id="IN-left"/>
            <Handle type="source" position={Position.Right} id="IN-right"/>
            
            {/* {isEditing? (<div style={{ textAlign: 'center', marginBottom: '10px' }}>
                <input 
                type="text" 
                value={text} 
                onChange={handleTextChange} 
                placeholder="Enter text..." 
                style={{ width: '100%' }}
                />
            </div>
            ):( */}
            <div style={{ textAlign: 'center', color: getTextColor(), fontWeight: 'bold', fontFamily:'sans-serif'}}>
                {getDisplayText()}
            </div>

            <IconButton
                aria-label="Delete element"
                pointerEvents="all"
                icon={<FiX/>}
                color="red"
                bg="transparent"
                border="none"
                size="small"
                onClick={()=> setNodes(prevNodes => prevNodes.filter(node=>node.id !== id))}
            />
        </div>
    );
};

export default InputNode;