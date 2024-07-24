import { IconButton } from '@chakra-ui/react';
import {FiX} from 'react-icons/fi';
import React from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';

const Join = ({ id, data }) => {
  const {setNodes} = useReactFlow();
  const imageUrl = `./icons/${data.label}.png`;
  return (
    <div>
      <img src={imageUrl} alt={`${data.label}`}></img>
        <Handle type="source" position={Position.Top} />
        <Handle type="source" position={Position.Bottom} />
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

export default Join;
