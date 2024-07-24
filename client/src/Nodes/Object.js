import { IconButton } from '@chakra-ui/react';
import {FiX} from 'react-icons/fi';
import React from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import axios from 'axios';

const Object = ({ id, data }) => {
  const {setNodes} = useReactFlow();
  const imageUrl = `./icons/${data.label}.png`;
  return (
    <div>
      <img src={imageUrl} alt={`${data.label}`}></img>
       
      {/* Handles */}
      <Handle type="source" position={Position.Right} id="source-right"/>
      <Handle type="source" position={Position.Top} id="source-top"/>

      <Handle type="target" position={Position.Left} id="target-left"/>
      <Handle type="target" position={Position.Bottom} id="target-bottom"/>

       {/* Delete button */}
      <IconButton
        aria-label="Delete element"
        pointerEvents="all"
        icon={<FiX/>}
        color="red"
        bg="transparent"
        border="none"
        size="small"
        // style={{ position: 'absolute', top: '0', right: '0' }}
        onClick={()=> setNodes(prevNodes => prevNodes.filter(node=>node.id !== id))}
      />
    </div>
  );
};

export default Object;
