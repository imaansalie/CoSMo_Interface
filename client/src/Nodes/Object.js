import { IconButton } from '@chakra-ui/react';
import {FiX} from 'react-icons/fi';
import React from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import axios from 'axios';

const Object = ({ id, data }) => {
  const {setNodes} = useReactFlow();
  const imageUrl = `./icons/${data.picture}.png`;

  const displayText= () =>{
    if(data.inputType === 'InstanceConstructor' || data.inputType === 'TypeConstructor'){
      return data.conID;
    }
    else{
      return data.label;
    }
  }

  return (
    <div>
       <div style={{ position: 'relative', display: 'inline-block' }}>
        <img src={imageUrl} alt={`${data.label}`} style={{ display: 'block', width: '100%' }} />
        <p style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', margin: 0 }}>
          {displayText()}
        </p>
      </div>

       
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