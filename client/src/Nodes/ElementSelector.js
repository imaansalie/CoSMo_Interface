import React from 'react';
import { useReactFlow } from 'reactflow';

const elements =[
    {code:"Ob", name:"Object"},
    {code:"Func", name:"Function"},
    {code:"Arg", name:"Arguments"},
    {code:"InstCo", name:"InstanceConstructor"},
    {code:"Man", name:"IsMandatory"},
    {code:"Join", name:"Join"},
    {code:"Prop", name:"Property"},
    {code:"RN", name:"Role_name"},
    {code:"TC1", name:"TypeConstructor"},
    {code:"VC", name:"ValueConstraint"},
];

const ElementSelector= () =>{

    const {setNodes} =useReactFlow();
    const generateUniqueId = () => `node_${Math.random().toString(36).substr(2, 9)}`;

    const onElementClick = (element) => {

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