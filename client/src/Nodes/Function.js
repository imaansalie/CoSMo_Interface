import { IconButton } from '@chakra-ui/react';
import {FiX} from 'react-icons/fi';
import React from 'react';
import { Handle, useReactFlow } from 'reactflow';

const Function = ({ id, data }) => {
  const {setNodes} = useReactFlow();
  return (
    <div>
      {/* <strong>{data.label}</strong> */}
      <img src="./icons/Function.png" alt={`${data.label}`}></img>
      <Handle type="target"/>
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

export default Function;
