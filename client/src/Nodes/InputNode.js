import React, {useEffect, useState, useRef} from 'react';
import {Handle, Position, useReactFlow} from 'reactflow';
import { IconButton } from '@chakra-ui/react';
import {FiX} from 'react-icons/fi';
import { px } from 'framer-motion';

const InputNode = ({id, data, selected}) =>{
    const {setNodes} = useReactFlow();

    const onDelete = () =>{
        setNodes((prevNodes) => prevNodes.filter((node) => node.id !==id));
        if(data.handleDelete){
          data.handleDelete(data.inputType, id);
        }
        else{
          console.error("handleDelete function not provided");
        }
      }

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
            
            <div>
                <div style={{ textAlign: 'center', color: getTextColor(), fontWeight: 'bold', fontFamily:'sans-serif', marginTop:'5px'}}>
                    {getDisplayText()}
                </div>

                <>
                    <Handle type="source" position={Position.Top} id="IN-top"/>
                    <Handle type="target" position={Position.Bottom} id="IN-bottom"/>
                </>
            </div>
            
            <IconButton
                aria-label="Delete element"
                pointerEvents="all"
                icon={<FiX/>}
                color="red"
                bg="transparent"
                border="none"
                size="small"
                onClick={onDelete}
            />
        </div>
    );
};

export default InputNode;