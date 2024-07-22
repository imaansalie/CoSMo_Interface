import React from 'react';
import { useReactFlow } from 'reactflow';

const adornments =[
    {code:"RN", name:"Role_name", type: "InputNode"},
    {code:"VC", name:"ValueConstraint", type: "InputNode"},
  ]

const AdornmentIconSelector= () =>{

    const {setNodes} =useReactFlow();
    const generateUniqueId = () => `node_${Math.random().toString(36).substr(2, 9)}`;

    const addTextNode = (adornment) => {
      setNodes((prevNodes) => [
        ...prevNodes,
        {
          id: generateUniqueId(),
          type: `${adornment.name}`, // Use the custom node type
          data: {
            label: '',
            inputType:`${adornment.name}`,
            onChange: (newText) => console.log('Text changed:', newText) // Handle text changes
          },
          position: { x: Math.random() * 200, y: Math.random() * 200 },
        },
      ]);
    };
    
    // const handleObjectClick = (element) =>{

    //   const x= Math.random() * 100;
    //   const y= Math.random() * 100;

    //   setNodes( (prevNodes) => [
    //     ...prevNodes, 
    //     {
    //         id: generateUniqueId(), 
    //         data: {label:element.name }, 
    //         type: `${element.name}`,
    //         position: {x:x, y:y},
    //     },
    //   ]);   
    //   console.log(`Added node: ${element.name} with ID ${generateUniqueId}`);
    // }

    // const onElementClick = (element) => {

    //     switch(element.type){
    //       case 'Object':
    //         handleObjectClick(element);
    //         break;
    //       case 'InputNode':
    //         addTextNode(element);
    //         break;
    //     }  
    // };

    return(
        <ul>
          {adornments.map((adornment,index)=>(
            <li key={index}>
              <button onClick={() => addTextNode(adornment)}>
                <img src={"/icons/"+adornment.name+".png"} className='selector-img'/>
                  <span className='name'>{adornment.name}</span>
              </button>  
            </li>
          ))}
        </ul>
    );
};

export default AdornmentIconSelector;