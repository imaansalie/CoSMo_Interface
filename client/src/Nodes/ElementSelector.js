import React, { useState } from 'react';
import { useReactFlow } from 'reactflow';

const elements =[
    {code:"Ob", name:"Object", type: "Object"},
    {code:"Func", name:"Function", type: "Object"},
    {code:"Arg", name:"Arguments", type: "Object"},
    {code:"InstCo", name:"InstanceConstructor", type: "Object"},
    {code:"Prop", name:"Property", type: "Object"},
    {code:"TC1", name:"TypeConstructor", type: "Object"},
];

const adornments =[
  {code:"RN", name:"Role_name", type: "InputNode"},
  {code:"VC", name:"ValueConstraint", type: "InputNode"},
  {code: "JO", name: "Join", type: "Object"}
]

const ElementSelector= ({setCurrentType, setNewNodeId}) =>{

    const {setNodes} =useReactFlow();
    const generateUniqueId = () => `node_${Math.random().toString(36).substr(2, 9)}`;

    const addTextNode = (adornment) => {

      const newNodeId=generateUniqueId();      
      setNodes((prevNodes) => [
        ...prevNodes,
        {
          id: generateUniqueId(),
          type: `${adornment.name}`, // Use the custom node type
          data: {
            label: adornment.name,
            inputType:`${adornment.name}`,
            onChange: (newText) => console.log('Text changed:', newText) // Handle text changes
          },
          position: { x: Math.random() * 200, y: Math.random() * 200 },
        },
      ]);

      setCurrentType(adornment.type);
      setNewNodeId(newNodeId);
    };
    
    const handleObjectClick = (element) =>{

      const x= Math.random() * 100;
      const y= Math.random() * 100;
      const newNodeId= generateUniqueId();

      setNodes( (prevNodes) => [
        ...prevNodes, 
        {
            id: generateUniqueId(), 
            data: {
              label:element.name,
              argument: '', 
            }, 
            type: `${element.name}`,
            position: {x:x, y:y},
        },
      ]);   
      setCurrentType(element.name);
      setNewNodeId(newNodeId);
    }

    const onElementClick = (element) => {

        switch(element.type){
          case 'Object':
            handleObjectClick(element);
            break;
          case 'InputNode':
            addTextNode(element);
            break;
        }  
    };

    return(
      <div>
        <ul>
          {elements.map((element,index)=>(
            <li key={index}>
              <button onClick={() => onElementClick(element)}>
                <img src={"/icons/"+element.name+".png"} className='selector-img'/>
                  <span className='name'>{element.name}</span>
              </button>  
            </li>
          ))}
        </ul>

        <ul>
        {adornments.map((adornment,index)=>(
          <li key={index}>
            <button onClick={() => onElementClick(adornment)}>
              <img src={"/icons/"+adornment.name+".png"} className='selector-img'/>
                <span className='name'>{adornment.name}</span>
            </button>  
          </li>
        ))}
        </ul>
      </div>
    );
};

export default ElementSelector;