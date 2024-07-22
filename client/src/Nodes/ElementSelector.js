import React from 'react';
import { useReactFlow } from 'reactflow';

const elements =[
    {code:"Ob", name:"Object", type: "Object"},
    {code:"Func", name:"Function", type: "Object"},
    {code:"Arg", name:"Arguments", type: "Object"},
    {code:"InstCo", name:"InstanceConstructor", type: "Object"},
    {code:"Prop", name:"Property", type: "Object"},
    {code:"TC1", name:"TypeConstructor", type: "Object"},
];

const ElementSelector= () =>{

    const {setNodes} =useReactFlow();
    const generateUniqueId = () => `node_${Math.random().toString(36).substr(2, 9)}`;

    const addTextNode = (element) => {
      setNodes((prevNodes) => [
        ...prevNodes,
        {
          id: generateUniqueId(),
          type: `${element.name}`, // Use the custom node type
          data: {
            label: '',
            inputType:`${element.name}`,
            onChange: (newText) => console.log('Text changed:', newText) // Handle text changes
          },
          position: { x: Math.random() * 200, y: Math.random() * 200 },
        },
      ]);
    };
    
    const handleObjectClick = (element) =>{

      const x= Math.random() * 100;
      const y= Math.random() * 100;

      setNodes( (prevNodes) => [
        ...prevNodes, 
        {
            id: generateUniqueId(), 
            data: {label:element.name }, 
            type: `${element.name}`,
            position: {x:x, y:y},
        },
      ]);   
      console.log(`Added node: ${element.name} with ID ${generateUniqueId}`);
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
    );
};

export default ElementSelector;