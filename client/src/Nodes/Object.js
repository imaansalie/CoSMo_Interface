import { BreadcrumbLink, IconButton } from '@chakra-ui/react';
import {FiX} from 'react-icons/fi';
import React from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import axios from 'axios';

const Object = ({ id, data}) => {
  const {setNodes} = useReactFlow();
  const imageUrl = `./icons/${data.picture}.png`;

  const displayText= () =>{
    // if(data.inputType === 'InstanceConstructor' || data.inputType === 'TypeConstructor'){
    //   return data.conID;
    // }
    // if(data.inputType === 'Property'){
    //   return `${data.itemLabel} (${data.itemID}) <br/> <br/> <br/>`;
    // }
    // else{
    //   return `${data.itemLabel} (${data.itemID})`;
    // }

    let textContent='';

    if(data.itemID !== ''){
      textContent = `${data.itemLabel} (${data.itemID})`;
    }
    
    let style ={};

    switch (data.inputType){
      case 'InstanceConstructor':
        style={ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', margin: 0 };
        textContent= `${data.conID}`;
        break;

        case 'TypeConstructor':
          style={ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', margin: 0 };
          textContent= `${data.conID}`;
          break;

      case 'Property':
        style ={position: 'absolute', top: '-50%', left: '50%', transform: 'translate(-50%, -50%)', margin: 0};
        break;

      default:
        style ={position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', margin: 0};
        break;
    }

    return {textContent, style};
  }

  const {textContent, style} = displayText();

  const onDelete = () =>{
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !==id));
    if(data.handleDelete){
      data.handleDelete(data.inputType, id);
    }
    else{
      console.error("handleDelete function not provided");
    }
  }

  return (
    <div>
       <div style={{ position: 'relative', display: 'inline-block' }}>
        <img src={imageUrl} alt={`${data.label}`} style={{ display: 'block', width: '100%' }} />
        <p style={{ fontFamily:'sans-serif', ...style }}>
          {textContent}
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
        onClick={onDelete}
      />
    </div>
  );
};

export default Object;