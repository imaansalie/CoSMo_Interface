import { IconButton } from '@chakra-ui/react';
import {FiX} from 'react-icons/fi';
import React from 'react';
import { Handle, useReactFlow } from 'reactflow';

const Object = ({ id, data }) => {
  const {setNodes} = useReactFlow();
  const imageUrl = `./icons/${data.label}.png`;
  return (
    <div>
      {/* <strong>{data.label}</strong> */}
      <img src={imageUrl} alt={`${data.label}`}></img>
      <div class="label">{data.label}</div>
       {/* Source Handle */}
       <Handle type="source" position="right" />
      {/* Target Handle */}
      <Handle type="target" position="left" />
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

export default Object;
