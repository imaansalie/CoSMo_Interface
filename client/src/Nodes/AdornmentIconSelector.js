import React from 'react';
import { useReactFlow } from 'reactflow';

const adornments =[
    {code:"RN", name:"Role_name", type: "InputNode"},
    {code:"VC", name:"ValueConstraint", type: "InputNode"},
    {code: "JO", name: "Join", type: "Join"}
  ]

const AdornmentIconSelector= () =>{

    const {setNodes, setEdges} =useReactFlow();
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

    const addNodeWithEdges = (element) => {
      const nodeId = generateUniqueId();
      const initialEdges = [
        { id: generateUniqueId(), source: nodeId, target: null, type: 'custom' },
        { id: generateUniqueId(), source: nodeId, target: null, type: 'custom' },
      ];
  
      setNodes((prevNodes) => [
        ...prevNodes,
        {
          id: nodeId,
          type: `${element.name}`,
          position: { x: Math.random() * 200, y: Math.random() * 200 },
          data: {label:element.name },
        },
      ]);
  
      setEdges((prevEdges) => [
        ...prevEdges,
        ...initialEdges
      ]);

      console.log("in");
    };

    const onElementClick = (element) => {

        switch(element.type){
          case 'Object':
            handleObjectClick(element);
            break;
          case 'InputNode':
            addTextNode(element);
            break;
          case 'Join':
            addNodeWithEdges(element);
            break;
        }  
    };

    return(
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
    );
};

export default AdornmentIconSelector;