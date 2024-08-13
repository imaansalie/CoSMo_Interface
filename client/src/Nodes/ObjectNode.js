import { BreadcrumbLink, IconButton, position } from '@chakra-ui/react';
import {FiX} from 'react-icons/fi';
import React from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import axios from 'axios';

const ObjectNode = ({ id, data}) => {
  const {setNodes} = useReactFlow();
  const imageUrl = `./icons/${data.picture}.png`;

  const displayText= () =>{
    let textContent='';

    if(data.itemID !== ''){
      textContent = `${data.itemLabel} (${data.itemID})`;
    }
    
    let style ={};

    switch (data.inputType){
      case 'InstanceConstructor':
        style={ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', margin: 0 };
        textContent= `C${data.conID}: ${data.itemLabel}`;
        break;

        case 'TypeConstructor':
          style={ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', margin: 0 };
          textContent= `C${data.conID}: ${data.itemLabel}`;
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
      {(data.inputType ==='Object' || data.inputType === 'Function') && (
        <>
          <Handle type="source" position={Position.Right} id="source-right"/>
          <Handle type="target" position={Position.Top} id="target-top" />
    
          <Handle type="target" position={Position.Left} id="target-left"/>
          <Handle type="target" position={Position.Bottom} id="target-bottom"/>
        </>
      )}

      {(data.inputType==='Join') && (
        <>
          <Handle type="source" position={Position.Right} id="source-right"/>
          <Handle type="source" position={Position.Top} id="source-top" />
    
          <Handle type="target" position={Position.Left} id="target-left"/>
          <Handle type="source" position={Position.Bottom} id="source-bottom"/>
        </>
      )}

      {(data.picture==='Property') && (
        <>
          <Handle type="source" position={Position.Right} id="source-right"/>
          <Handle type="target" position={Position.Top} id="target-top" />
    
          <Handle type="target" position={Position.Left} id="target-left"/>
          <Handle type="target" position={Position.Bottom} id="target-bottom"/>
        </>
      )}

      {(data.inputType === 'InstanceConstructor' || data.inputType === 'TypeConstructor') && (
        <>
          <Handle type="source" position={Position.Right} id="source-right"/>
          <Handle type="source" position={Position.Top} id="source-top" />
    
          <Handle type="target" position={Position.Left} id="target-left"/>
          <Handle type="target" position={Position.Bottom} id="target-bottom"/>
        </>
      )}
      
      {(data.picture==='Arguments') &&(
        <>
          <Handle type="source" position={Position.Right} id="source-right"/>
          <Handle type="target" position={Position.Left} id="target-left"/>
        </>
      )}

      {data.picture==='Arguments_2'&&(
        <>
          <Handle type="source" position={Position.Right} id="source-right"/>
          <Handle type="source" position={Position.Top} id="source-top"/>
          <Handle type="target" position={Position.Left} id="target-left"/>
        </>
      )}

      {data.picture==='Arguments_3'&&(
        <>
          <Handle type="source" position={Position.Right} id="source-right"/>
          <Handle type="source" position={Position.Top} id="source-top" style ={{left:'35%'}}/>
          <Handle type="source" position={Position.Bottom} id="source-bottom" style ={{left:'55%'}}/>
          <Handle type="target" position={Position.Left} id="target-left"/>
        </>
      )}

      {data.picture==='Arguments_4'&&(
        <>
          <Handle type="source" position={Position.Right} id="source-right"/>
          <Handle type="source" position={Position.Topleft} id="source-top" style ={{left:'30%'}}/>
          <Handle type="source" position={Position.TopRight} id="source-top2" style ={{left:'65%'}}/>
          <Handle type="source" position={Position.Bottom} id="source-bottom" style ={{left:'45%'}}/>
          <Handle type="target" position={Position.Left} id="target-left"/>
        </>
      )}

      {data.picture === 'Property_3' && (
        <>
        <Handle type="source" position={Position.Right} id="source-right"/>
        <Handle type="target" position={Position.Left} id="target-left"/>
        <Handle type="source" position={Position.Top} id="source-top"/>
      </>
      )}

      {data.picture === 'Property_4' && (
        <>
        <Handle type="source" position={Position.Right} id="source-right"/>
        <Handle type="target" position={Position.Left} id="target-left"/>
        <Handle type="source" position={Position.Top} id="source-top" style ={{left:'35%'}}/>
        <Handle type="source" position={Position.Bottom} id="source-bottom"style ={{left:'60%'}}/>
      </>
      )}

      {data.picture === 'Property_5' && (
        <>
        <Handle type="source" position={Position.Right} id="source-right"/>
        <Handle type="target" position={Position.Left} id="target-left"/>
        <Handle type="source" position={Position.TopLeft} id="source-topLeft" style ={{left:'30%'}}/>
        <Handle type="source" position={Position.TopRight} id="source-topRight" style ={{left:'65%'}}/>
        <Handle type="source" position={Position.Bottom} id="source-bottom"style ={{left:'47%'}}/>
      </>
      )}

       {/* Delete button */}
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

export default ObjectNode;