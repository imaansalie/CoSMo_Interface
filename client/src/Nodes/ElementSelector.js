import React, { useState, useEffect } from 'react';
import { useReactFlow } from 'reactflow';

const elements =[
    {code:"Ob", name:"Object", type: "Object", label: "Object"},
    {code:"Func", name:"Function", type: "Object", label: "Function"},
    {code:"Arg", name:"Arguments", type: "Object", label: "Arguments"},
    {code:"InstCo", name:"InstanceConstructor", type: "Object", label: "Instance Constructor"},
    {code:"Prop", name:"Property", type: "Object", label: "Property"},
    {code:"TC1", name:"TypeConstructor", type: "Object", label: "Type Constructor"},
];

const adornments =[
  {code:"RN", name:"Role_name", type: "InputNode", label: "Role Name"},
  {code:"VC", name:"ValueConstraint", type: "InputNode", label: "Value Constraint"},
  {code: "JO", name: "Join", type: "Object", label: "Join"}
]

const ElementSelector= ({setCurrentType, setNewNodeId, elementDeleted, propertyDeleted, nextGroup}) =>{

    const {setNodes} =useReactFlow(); // hook to access and manipulate nodes
    const generateUniqueId = () => `node_${Math.random().toString(36).substr(2, 9)}`;
    const [conID, setConID] =useState(1);
    const [roleID, setRoleID] = useState(2);

    //function to add text node (value constraint and role type -- must adapt to use search form as well)
    const addTextNode = (adornment) => {

      const newNodeId=generateUniqueId();      
      setNodes((prevNodes) => [
        ...prevNodes,
        {
          id: newNodeId,
          type: `${adornment.name}`, // Use the custom node type
          data: {
            label: adornment.label,
            inputType:`${adornment.name}`,
            picture: adornment.name,
            itemLabel: '',
            itemID:'',
            conID: conID
          },
          position: { x: Math.random() * 200, y: Math.random() * 200 },
        },
      ]);

      setCurrentType(adornment.name);
      setNewNodeId(newNodeId);
    };
    
    //add object node
    const handleObjectClick = (element) =>{

      const x= Math.random() * 100;
      const y= Math.random() * 100;
      const newNodeId= generateUniqueId();

      if (element.name === 'InstanceConstructor'|| element.name ==='TypeConstructor'){
        setConID(conID+1);
      }

      if(element.name === 'Property'){
        setRoleID((prevRoleID) => prevRoleID +2 );
      }

      setNodes( (prevNodes) => [
        ...prevNodes, 
        {
            id: newNodeId, 
            data: {
              label:element.label,
              inputType: element.name,
              picture:element.name,
              itemLabel: '',
              conID: `C${conID}`,
              itemID: '', 
              roleID: element.name === 'Property' ? roleID: null,
            }, 
            type: `${element.name}`,
            position: {x:x, y:y},
        },
      ]);   

      setCurrentType(element.name);
      setNewNodeId(newNodeId);
    }

    //switch between node type handlers
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

    //decrement constructor counter on node delete
    useEffect(() => {
      if(elementDeleted){
        setConID(conID-1);
      }
    }, [elementDeleted])

    useEffect(() => {
      if(propertyDeleted){
        setRoleID(Math.max((prevRoleID)=> prevRoleID -2, 2));
      }
    }, [propertyDeleted])

    useEffect(() => {
      if(nextGroup){
        setRoleID(2);
      }
    }, [nextGroup])

    return(
      <div>
        <ul>
          {elements.map((element,index)=>(
            <li key={index}>
              <button onClick={() => onElementClick(element)}>
                <img src={"/icons/"+element.name+".png"} className='selector-img' alt='icon'/>
                  <span className='name'>{element.label}</span>
              </button>  
            </li>
          ))}
        </ul>

        <ul>
        {adornments.map((adornment,index)=>(
          <li key={index}>
            <button onClick={() => onElementClick(adornment)}>
              <img src={"/icons/"+adornment.name+".png"} className='selector-img' alt='img'/>
                <span className='name'>{adornment.label}</span>
            </button>  
          </li>
        ))}
        </ul>
      </div>
    );
};

export default ElementSelector;