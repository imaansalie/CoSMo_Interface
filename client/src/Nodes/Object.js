import { BreadcrumbLink, IconButton, position } from '@chakra-ui/react';
import {FiX} from 'react-icons/fi';
import React from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import axios from 'axios';

const Object = ({ id, data}) => {
  const {setNodes} = useReactFlow();
  const imageUrl = `./icons/${data.picture}.png`;

  const displayText= () =>{
    let textContent='';

    if(data.itemID !== ''){
      textContent = `${data.conID} ${data.itemLabel} (${data.itemID})`;
    }
    
    let style ={};

    switch (data.inputType){
      case 'InstanceConstructor':
        style={ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', margin: 0 };
        textContent= `${data.conID}: ${data.itemLabel}`;
        break;

        case 'TypeConstructor':
          style={ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', margin: 0 };
          textContent= `${data.conID}: ${data.itemLabel}`;
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

  const getHandleStyle = (position) =>{
    let style={};

    switch(data.picture){
      case 'Arguments_3':
        if(position === 'top'){
          style={left:'35%'};
        }
        if(position === 'bottom'){
          style={left:'55%'};
        }
        break;
      case 'Arguments_4':
        if(position === 'top'){
          style={left:'30%'};
        }
        if(position === 'bottom'){
          style={left:'45%'};
        }
        if(position === 'top2'){
          style={left:'65%'};
        }
        break;
    }
    return style;
  }

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
      {data.inputType !=='Arguments' &&(
        <>
          <Handle type="source" position={Position.Right} id="source-right"/>
          <Handle type="target" position={Position.Top} id="target-top" />
    
          <Handle type="target" position={Position.Left} id="target-left"/>
          <Handle type="target" position={Position.Bottom} id="target-bottom"/>
        </>
      )}
      
      {data.picture==='Arguments'&&(
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
          <Handle type="source" position={Position.Top} id="source-top" style ={getHandleStyle('top')}/>
          <Handle type="source" position={Position.Bottom} id="source-bottom" style ={getHandleStyle('bottom')}/>
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