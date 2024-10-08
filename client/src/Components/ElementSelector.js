import React, { useState, useEffect } from 'react';
import { useReactFlow } from 'reactflow';
import { Box } from '@chakra-ui/react';
import { SearchForm } from './SearchForm';
import ReactTooltip from 'react-tooltip';
import axios from 'axios';

const elements =[
    {code:"Ob", name:"Object", type: "Object", label: "Object", tooltip: "Add an object to the constructor, representing a Q item."},
    {code:"Func", name:"Function", type: "Object", label: "Function", tooltip: "Apply a function to the constructor (Z item)."},
    {code:"Arg", name:"Arguments", type: "Object", label: "Arguments", tooltip: "Supply functions with arguments by connecting it to at least one object and one function."},
    {code:"InstCo", name:"InstanceConstructor", type: "Object", label: "Instance Constructor", tooltip: "Initiate a constructor at the instance level."},
    {code:"Prop", name:"Property", type: "Object", label: "Property", tooltip: "Add a property to the constructor to relate objects (at least two) to one another."},
    {code:"TC1", name:"TypeConstructor", type: "Object", label: "Type Constructor", tooltip: "Initiate a constructor at the type level."},
];

const adornments =[
  {code:"RN", name:"Role_name", type: "InputNode", label: "Role Name", tooltip: "Name a role by connecting it to the corresponding Property handle."},
  {code:"VC", name:"ValueConstraint", type: "InputNode", label: "Value Constraint", tooltip: "Add a Value Constraint to an object or function."},
  {code: "JO", name: "Join", type: "Object", label: "Join", tooltip: "Join two objects or properties by connecting it to both with the Join connector."},
];

const args = [
  {code: "A1", picture:"Arguments", type: "Object", label:"One Argument", name:'Arguments'},
  {code: "A2", picture:"Arguments_2", type: "Object", label:"Two Arguments", name: 'Arguments'},
  {code: "A3", picture:"Arguments_3", type: "Object", label:"Three Arguments", name:'Arguments'},
  {code: "A4", picture:"Arguments_4", type: "Object", label:"Four Arguments", name: 'Arguments'},
];

const properties = [
  {code: "P2", picture:"Property", type: "Object", label:"Two Roles", name:'Property'},
  {code: "P3", picture:"Property_3", type: "Object", label:"Three Roles", name: 'Property'},
  {code: "P4", picture:"Property_4", type: "Object", label:"Four Roles", name:'Property'},
  {code: "P5", picture:"Property_5", type: "Object", label:"Five Roles", name: 'Property'},
];

const ElementSelector= ({setCurrentType, setNewNodeId, elementDeleted, propertyDeleted, nextGroup, setShowForm, setCurrentNodeID, handleAssign, constructorAdded}) =>{

    const {setNodes} =useReactFlow(); // hook to access and manipulate nodes
    const generateUniqueId = () => `node_${Math.random().toString(36).substr(2, 9)}`;
    const [conID, setConID] =useState(1);
    const [localRoleID, setLocalRoleID] = useState(0);
    const [showArgs, setShowArgs] = useState(false);
    const [showProps, setShowProps] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [initialConID, setInitialConID] = useState(0);
    const [VCinput, setVCInput] = useState(null);

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
    const handleObjectClick = async(element) =>{

      const fetchedConID = await getConID();

      const x= Math.random() * 100;
      const y= Math.random() * 100;
      const newNodeId= generateUniqueId();

      if (element.name === 'InstanceConstructor'|| element.name ==='TypeConstructor'){
        setConID(conID + 1);
        setShowForm(true);
        setCurrentNodeID(newNodeId);
      }

      if(element.name === 'Property'){
        setLocalRoleID(localRoleID +2 );
        setShowProps(true);
        setSelectedProperty(null);
        return;
      }

      if(element.name === 'Arguments'){
        setShowArgs(true);
        return;
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
              conID: conID,
              itemID: '', 
              roleID: element.name === 'Property' ? localRoleID: null,
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

    const handleArgumentsClick = (arg) =>{
      setShowArgs(!showArgs);
      
      const x= Math.random() * 100;
      const y= Math.random() * 100;
      const newNodeId= generateUniqueId();

      setNodes( (prevNodes) => [
        ...prevNodes, 
        {
            id: newNodeId, 
            data: {
              label:arg.label,
              inputType: arg.name,
              picture:arg.picture,
              itemLabel: '',
              conID: `C${conID}`,
              itemID: '', 
              roleID: arg.name === 'Property' ? localRoleID: null,
            }, 
            type: `${arg.name}`,
            position: {x:x, y:y},
        },
      ]);   
    }

    const handlePropClick = (property) =>{
      setShowProps(!showProps);
      setSelectedProperty(property);
      console.log(selectedProperty);
      
      const x= Math.random() * 100;
      const y= Math.random() * 100;
      const newNodeId= generateUniqueId();

      setNodes( (prevNodes) => [
        ...prevNodes, 
        {
            id: newNodeId, 
            data: {
              label:property.label,
              inputType: property.name,
              picture:property.picture,
              itemLabel: '',
              conID: `C${conID}`,
              itemID: '', 
              roleID: property.name === 'Property' ? localRoleID: null,
            }, 
            type: `${property.name}`,
            position: {x:x, y:y},
        },
      ]);   
      setCurrentType('Property');
      setNewNodeId(newNodeId);
    }

    //get latest ID from database
    const getConID = async() =>{
      try{
        const response = await axios.post('http://localhost:3001/getID');
        if(response.data.length>0){
          const newConID = response.data[0].idconstructors + 1;
          console.log(newConID);
          return newConID;
        }
        else{
          return 1;
        }
        
      } catch (error){
          console.error("Error getting ID: ", error);
          throw error;
      }
    }

    const initializeConID = async() =>{
      try{
        const DB_ConID = await getConID();
        setInitialConID(DB_ConID);
        setConID(DB_ConID);        
      } catch (error){
        console.error("Failed to initialize conID", error);
      }
    }

    //decrement constructor counter on node delete
    useEffect(() =>{
      initializeConID();
    }, [constructorAdded]);

    useEffect(() => {
      if(elementDeleted){
        setConID(Math.max(conID -1, initialConID));
        console.log("after delete: ", conID);
      }
    }, [elementDeleted])

    useEffect(() => {
      if(propertyDeleted){
        setLocalRoleID(Math.max(localRoleID -2, 0));
      }
    }, [propertyDeleted])

    useEffect(() => {
      if(nextGroup){
        setLocalRoleID(0);
      }
    }, [nextGroup])

    return(
      <div>
        <div className='elements'>
          <ul style={{marginBottom:"2px"}}>
            {elements.map((element,index)=>(
              <li key={index}>
                <button onClick={() => onElementClick(element)} className='element-button'>
                  <img src={"/icons/"+element.name+".png"} className='selector-img' alt='icon'/>
                  <span className='name'>{element.label}</span>
                  <div className='element-tooltip'>
                    <span className='element-tooltip-text'>{element.tooltip}</span>
                  </div>
                  
                </button>  
              </li>
            ))}
          </ul>

          <ul>
          {adornments.map((adornment,index)=>(
            <li key={index}>
              <button onClick={() => onElementClick(adornment)} className='element-button'>
                <img src={"/icons/"+adornment.name+".png"} className='selector-img' alt='img'/>
                  <span className='name'>{adornment.label}</span>
                  <div className='element-tooltip'>
                    <span className='element-tooltip-text'>{adornment.tooltip}</span>
                  </div>
              </button>  
            </li>
          ))}
          </ul>
        </div>
        
        {showArgs && (
          <Box className='args box-common'>
            <p>Choose the number of arguments:</p>
            <ul>
              {args.map((arg, index) => (
                <li key = {index} className='args-list-item'>
                  <button className='arg-button' onClick={() => handleArgumentsClick(arg)}>
                    <img src={"/icons/"+arg.picture+".png"} className='arguments-img' alt='img'/>
                    <span className='arg-name'>{arg.label}</span>
                  </button>
                </li>
              ))}
            </ul>
            <button className= 'cancelArgs' onClick={() => setShowArgs(false)}>Cancel</button>
          </Box>
        )}

        {showProps && (
          <Box className='args box-common'>
            <p>Choose the number of roles:</p>
            <ul>
            {properties.map((property, index) => (
              <li key = {index} className='args-list-item'>
                <button className='arg-button' onClick={() => handlePropClick(property)}>
                  <img src={"/icons/"+property.picture+".png"} className='arguments-img' alt='img'/>
                  <span className='arg-name'>{property.label}</span>
                </button>
              </li>
            ))}
            </ul>
            <button className= 'cancelArgs' onClick={() => setShowProps(false)}>Cancel</button>
          </Box>
        )}
      </div>     
    );
};

export default ElementSelector;