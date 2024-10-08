import React, {useEffect, useRef, useState } from 'react';
import {Box, Button} from "@chakra-ui/react";
import ReactFlow, {ReactFlowProvider, addEdge,Controls,Background,useNodesState,useEdgesState} from 'reactflow';
import 'reactflow/dist/style.css';
import ElementSelector from './ElementSelector';
import Role from '../Edges/Role';
import SubConstructorEdge from '../Edges/SubConstructorEdge'
import InstanceEdge from '../Edges/InstanceEdge';
import PartOfEdge from '../Edges/PartOfEdge';
import InstanceConstructorEdge from '../Edges/InstanceConstructorEdge';
import InputNode from '../Nodes/InputNode';
import IsMandatory from '../Edges/IsMandatory';
import JoinEdge from '../Edges/JoinEdge';
import Role_name from '../Edges/Role_name';
import ValueConstraint from '../Edges/ValueConstraint';
import { SearchForm } from './SearchForm';
import { TextGenerator } from './TextGenerator';
import { LanguageDD } from './LanguageDD';
import {ConstructorSaver} from './ConstructorSaver';
import {ConstructorForm} from './ConstructorForm';
import { BsPlusCircle } from 'react-icons/bs';
import ObjectNode from '../Nodes/ObjectNode';
import { useLocation } from 'react-router-dom';
import { GrCircleInformation } from "react-icons/gr";

const nodeTypes = {
  'Object': ObjectNode,
  'Function': ObjectNode,
  'Arguments': ObjectNode,
  'IsMandatory': ObjectNode,
  'InstanceConstructor': ObjectNode,
  'Join': ObjectNode,
  'Property': ObjectNode,
  'Role_name': InputNode,
  'TypeConstructor': ObjectNode,
  'ValueConstraint': InputNode,
};

const edgeTypes = {
  'Role': Role,
  'Sub-constructor': SubConstructorEdge,
  'Instance': InstanceEdge,
  'PartOf_Object': PartOfEdge,
  'InstanceConstructor_Connector':InstanceConstructorEdge,
  'IsMandatory': IsMandatory,
  'Join': JoinEdge,
  'Role_name': Role_name,
  'ValueConstraint': ValueConstraint
}

const connectors = [
  {code: "RE", picture: "Role", name:"Role", label: "Role"},
  {code: "SCE", picture: "Sub-constructor", name:"Sub-constructor", label: "Sub Constructor Of"},
  {code: "IE", picture: "Instance", name: "Instance", label: "Instance Of"},
  {code: "POE", picture: "PartOf_Object", name: "PartOf_Object", label: "Part Of"},
  {code: "ICE", picture: "InstanceConstructor_Connector", name: "InstanceConstructor_Connector", label: "Instance Constructor"},
  {code: "IM", picture: "IsMandatory_Connector", name:"IsMandatory", label: "Is Mandatory"},
  {code: "JO", picture: "Join_connector", name: "Join", label: "Join"},
  {code: "RN", picture: "RN_connector", name: "Role_name", label: "Role Name Connector"},
  {code: "VC", picture: "VC_connector", name: "ValueConstraint", label: "Value Constraint Connector"},
]

const initialNodes = [];
const initialEdges = [];

const ConstructorBuilder = ({isNavbarVisible, addedNodes, addedEdges, setAddedNodes, setAddedEdges}) => {

  //state hook for text generator string
  const [nodeLabels, setNodeLabels] = useState([]);
  const [newNodeId, setNewNodeId] = useState(null);

  //track edge type selected by user
  const [selectedEdgeType, setSelectedEdgeType] = useState('Role');
  
  //track type of added nodes, and deleted nodes
  const [currentType, setCurrentType] = useState(null);
  const [checkDeleted, setCheckDeleted] = useState(false);

  //track property and node groups by conID to ensure role counters increment properly
  const [propertyDeleted, setPropertyDeleted] = useState(false);
  const [nextGroup, setNextGroup] = useState(false);

  const showSearchForm = currentType==='Property' || currentType === 'Object' || currentType === 'Role_name'|| currentType === 'ValueConstraint' || currentType === 'Function';

  //constructor label input form states
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState('');
  const [currentNodeID, setCurrentNodeID]= useState(null);

  const [errorMessage, setErrorMessage] = useState('');

  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [constructorAdded, setConstructorAdded] = useState(false);

  const [saveForm, setSaveForm]= useState(false);

  //states for adding existing constructors
  const [constructorForm, setConstructorForm] = useState(false);

  //track if value constraint takes custom input or not
  const [VCinput, setVCInput] = useState(false);

  //loading user made constructors
  const {state} = useLocation();
  const { nodes: locationNodes = [], edges: locationEdges = [] } = state || {};
  const [nodes, setNodes, onNodesChange] = useNodesState(locationNodes.length > 0 ? locationNodes : initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(locationEdges.length > 0 ? locationEdges : initialEdges);

  const [clearNodes, setClearNodes] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const textGeneratorRef = useRef();

  //input form functions
  const handleInputChange = (e) =>{
    setFormData(e.target.value);
  }

  const handleFormSubmit = (e) =>{
    e.preventDefault();

    if(currentNodeID){
      setNodes((prevNodes) => 
        prevNodes.map((node) =>
          node.id === currentNodeID ? {
            ...node,
            data: {
              ...node.data,
              itemLabel: formData
            }
          } : node
        )
      )
    }

    setFormData('');
    setShowForm(false);
    setCurrentNodeID(null);
  }

  //handles adding edges (connectors) to between nodes using the selected edge type
  const onConnect = (params) => {
    const sourceNode = nodes.find((node) => node.id === params.source);
    const targetNode = nodes.find((node) => node.id === params.target);

    if(sourceNode && targetNode){ //check if both source node and target node exist

      const updatedConID_src = sourceNode.data.conID;
      const updatedConID_tgt = targetNode.data.conID;

  
      setEdges((eds) => addEdge({...params, type:selectedEdgeType}, eds)); //add edge
      
      //update conID of node -- ensures that all elements connected to some constructor can be tracked
      if(targetNode.data.inputType !== 'TypeConstructor' && targetNode.data.inputType !== 'InstanceConstructor'&& sourceNode.data.inputType !== 'ValueConstraint' && sourceNode.data.inputType !== 'Role_name' && sourceNode.data.inputType !== 'Join'){ 
        updateNodeConID(params.target, updatedConID_src);
      }

      if(sourceNode.data.inputType === 'ValueConstraint' || sourceNode.data.inputType === 'Role_name' || sourceNode.data.inputType === 'Join'){
        updateNodeConID(params.source, updatedConID_tgt);
      }

      if(sourceNode.data.inputType === 'Object' && targetNode.data.inputType==='Arguments'){
        updateNodeConID(params.target, updatedConID_src);
      }

      if(sourceNode.data.inputType === 'Arguments' && targetNode.data.inputType==='Object'){
        updateNodeConID(params.target, updatedConID_src);
      }
    
    }else{
      console.error("Source or target node not found");
    }
  };

  //helper method to allow connected nodes to inherit source conID
  const updateNodeConID = (targetNodeID, conID) =>{
    setNodes((nds) =>
      nds.map((node) =>{
        if(node.id === targetNodeID){
          return{
            ...node,
            data:{
              ...node.data,
              conID: conID,
            },
          };
        }
        return node;
      })
    );
  }
  
  //setting edge type
  const handleEdgeChange = (connector) =>{
    setSelectedEdgeType(connector.name);
  }

  // assign selected data item to node
  const handleAssign = (item, itemType) => {
    if(item === 'cancelled'){
      setNodes((prevNodes) => prevNodes.filter((node) => node.id !==newNodeId));
      setNewNodeId(null);
    }
    else if(itemType !== 'ValueConstraint'){
      setNodes((prevNodes) => //update state of nodes
        prevNodes.map((node) =>//check each node
          node.id === newNodeId ? { //check if node ID matches newNodeID
            ...node, //create a new node object with updated data
            data: { 
              ...node.data, //copy the existing data
              itemLabel: item.label,
              itemID: item.itemID }
            } 
            : node //if it doesn't match, return the node as is
        ),
      );
      setNewNodeId(null);
    }
    else{
      if(!VCinput){
        setNodes((prevNodes) => //update state of nodes
          prevNodes.map((node) =>//check each node
            node.id === newNodeId ? { //check if node ID matches newNodeID
              ...node, //create a new node object with updated data
              data: { 
                ...node.data, //copy the existing data
                itemLabel: item.label, 
                itemID: item.itemID }
              } 
              : node //if it doesn't match, return the node as is
          ),
        );
        setNewNodeId(null);
      }else{
        setNodes((prevNodes) =>
          prevNodes.map((node) =>//check each node
          node.id === newNodeId ? { //check if node ID matches newNodeID
            ...node, //create a new node object with updated data
            data: { 
              ...node.data, //copy the existing data
              itemLabel: null,
              itemID: item}
            } 
            : node //if it doesn't match, return the node as is
        ),
        );
        setNewNodeId(null);
      }
    }
  };

  //check if constructor has been deleted
  const handleNodeDelete = (inputType, nodeId) =>{
    if (inputType === 'InstanceConstructor' || inputType === 'TypeConstructor') {
      setCheckDeleted(true);
    }

    if(inputType === 'Property'){
      setPropertyDeleted(true);
    }

    setEdges((prevEdges) => prevEdges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId))
  }

  //functions to clear all nodes once confirmed or cancelled

  const clearAllNodes = () =>{
    nodes.forEach(node =>{
      const inputType = node.data.inputType;
      const nodeId= node.id;

      if(inputType === 'InstanceConstructor' || inputType === 'TypeConstructor' || inputType === 'Property'){
        handleNodeDelete(inputType, nodeId);
      }
    });

    setNodes([]);
    setEdges([]);
    setNodeLabels([]);
    setClearNodes(false);
  }

  const handleClearCancel = () =>{
    setClearNodes(false);
  }

  const handleConstructorCancel = () =>{
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !==newNodeId));
    setNewNodeId(null);
    setShowForm(false);
    setCheckDeleted(true);
  }

  const handleClearError = () =>{
    setErrorMessage(null);
    setNodeLabels([]);
  }

  const handleClearButton = () =>{
    if(nodes.length>0 || edges.length>0){
      setClearNodes(true);
    }
  }

  //after informing element selector, reset checkDeleted boolean to true after 1 second
  useEffect(() =>{
    if(checkDeleted){
      setTimeout(() =>setCheckDeleted(false), 1000);
    }
  }, [checkDeleted]);

  useEffect(() => {
    if(propertyDeleted){
      setTimeout(() => setPropertyDeleted(false), 1000);
    }
  }, [propertyDeleted]);

  useEffect(() => {
    if(nextGroup){
      setTimeout(() => setNextGroup(false), 1000);
    }
  }, [nextGroup]);

  //Integrate added nodes and edges into the existing state
  useEffect(() =>{

    const mergeUniqueItems = (existingItems, newItems, key) => {
      const existingIds = new Set(existingItems.map(item => item[key]));
      return [
        ...existingItems,
        ...newItems.filter(item => !existingIds.has(item[key]))
      ];
    };

    const calculateConstructorHeight = (nodes) => {
      const minY = Math.min(...nodes.map(node => node.position.y));
      const maxY = Math.max(...nodes.map(node => node.position.y));
      return maxY - minY;
    };

    const calculateNewPosition = (existingNodes) =>{
      if (existingNodes.length === 0) return 0;
      else{
        const minY = Math.min(...existingNodes.map(node => node.position.y));
        return minY;
      }
    }

    const positionNodes = (newNodes, existingNodes) =>{
      const newPosition = calculateNewPosition(existingNodes);
      const constructorHeight = calculateConstructorHeight(newNodes);
      return newNodes.map((node, index) => ({
        ...node,
        position:{
          x:node.position.x,
          y:node.position.y-newPosition - constructorHeight - 200,
        }
      }))
    }

    if (nodes.length > 0) {
      if(locationNodes.length > 0 || locationEdges.length > 0) {

        const positionedLocationNodes= positionNodes(locationNodes, nodes);
        // Merge location nodes and edges into the state
        setNodes(nds => mergeUniqueItems(nds, positionedLocationNodes, 'id'));
        setEdges(eds => mergeUniqueItems(eds, locationEdges, 'id'));
    
        // Clear location nodes and edges after setting them
        locationNodes.length = 0;
        locationEdges.length = 0;
      }
  
      if(addedNodes.length>0 && addedEdges.length>0){
        const positionedAddedNodes= positionNodes(addedNodes, nodes);
        setNodes(nds => mergeUniqueItems(nds, positionedAddedNodes, 'id'));
        setEdges(eds => mergeUniqueItems(eds, addedEdges, 'id'));
        setAddedNodes([]);
        setAddedEdges([]);
      }
    }else{
      if (locationNodes.length > 0 || locationEdges.length > 0) {
        setNodes(nds => mergeUniqueItems(nds, locationNodes, 'id'));
        setEdges(eds => mergeUniqueItems(eds, locationEdges, 'id'));
      }

      if (addedNodes.length > 0 && addedEdges.length > 0) {
          setNodes(nds => mergeUniqueItems(nds, addedNodes, 'id'));
          setEdges(eds => mergeUniqueItems(eds, addedEdges, 'id'));
          setAddedNodes([]);
          setAddedEdges([]);
      }
    }
  }, [locationNodes, locationEdges, addedNodes, addedEdges]);

  //testing

  const addNodesAndEdges = (newNodes, newEdges) => {
    setNodes((currentNodes) => [...currentNodes, ...newNodes]);
    setEdges((currentEdges) => [...currentEdges, ...newEdges]);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addNodesAndEdges = addNodesAndEdges;
    }

    //clean up the window object when the component unmounts
    return () => {
      if (typeof window !== 'undefined') {
        delete window.addNodesAndEdges;
      }
    };
  }, []);  

  //pass handleDelete prop to Object
  const mappedNodes = nodes.map(node =>({
    ...node,
    data:{
      ...node.data,
      handleDelete: handleNodeDelete,
    }
  }));

  return (
    <ReactFlowProvider>
        <div className="FlowTest">
            <div className={`ConstructorBuilder ${!isNavbarVisible ? 'full-width' : ''}`}>
              <h1>Constructor Builder </h1>

              <div className='CB-options'>
                <LanguageDD
                  selectedLanguage={selectedLanguage}
                  setSelectedLanguage={setSelectedLanguage}
                />

                <Button className='AddConstructorButton' onClick= {()=>setConstructorForm(true)}>
                  <BsPlusCircle/> Add an existing Constructor</Button>
              </div>

              <Box border="1px solid gray" className='Builder'>
                  <ReactFlow
                    nodes={mappedNodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                  >
                    <Controls />
                    <Background />
                  </ReactFlow>
              </Box>
              
              <div className='buttons'>
                <TextGenerator
                  ref={textGeneratorRef}
                  nodes={nodes}
                  edges={edges}
                  nodeLabels={nodeLabels}
                  setNodeLabels={setNodeLabels}
                  errorMessage={errorMessage}
                  setErrorMessage={setErrorMessage}
                  setNextGroup={setNextGroup}
                  selectedLanguage={selectedLanguage}
                />

                <ConstructorSaver
                  nodes={nodes}
                  edges={edges}
                  nodeLabels={nodeLabels}
                  setConstructorAdded= {setConstructorAdded}
                  errorMessage={errorMessage}
                  setSaveMessage= {setSaveMessage}
                  saveForm={saveForm}
                  setSaveForm= {setSaveForm}
                  textGeneratorRef={textGeneratorRef}
                />

                <button className='clear-button' onClick={() => handleClearButton()}>Clear all</button>
              </div>

              <div data-testid = 'text' className='Textbox'>
                  {nodeLabels.length > 0 && !errorMessage &&(
                  <p dangerouslySetInnerHTML={{ __html: nodeLabels[0] }} />
                  )}
              </div>
            </div>
            
            <div className='toolbox'>
              
              <div className='toolbox-info'>
                <p>Click on an element</p>
                <div className='tooltip'>
                  <GrCircleInformation className='info-icon'/>
                  <span className= 'tooltiptext'>Click on an element to add it to the diagram.</span>
                </div>
              </div>
              
              <div>
                <ElementSelector 
                  setCurrentType={setCurrentType} 
                  setNewNodeId={setNewNodeId}
                  elementDeleted={checkDeleted}
                  propertyDeleted={propertyDeleted}
                  nextGroup={nextGroup}
                  setShowForm={setShowForm}
                  setCurrentNodeID={setCurrentNodeID}
                  handleAssign={handleAssign}
                  constructorAdded={constructorAdded}
                  />  
              </div>
            
              <div className='toolbox-info'>
                <p>Select a connector</p>
                <div className='tooltip'>
                  <GrCircleInformation className='info-icon'/>
                  <span className= 'tooltiptext'>Click on a connector to select it. To connect two elements, drag the connector between the handles of the elements.</span>
                </div>
              </div>
              <div className='connectors'>
                <ul>
                {connectors.map((connector, index) => (
                  <li key={index} className='connector'>
                    <label className='radio-label'>
                      <input
                        type='radio'
                        name='connector'
                        value={connector.label}
                        onChange={() => handleEdgeChange(connector)}
                        className='radio-input'
                      />
                      <img
                        src={`/icons/${connector.picture}.png`}
                        className='selector-img'
                        alt={connector.label}
                      />
                      <span className='name'>{connector.label}</span>
                    </label>
                  </li>
                ))}
                </ul>
              </div>
            </div>

            {newNodeId && showSearchForm &&(
            <SearchForm onAssign={handleAssign} itemType={currentType} setVCInput= {setVCInput}/>
            )}

            {showForm && (
              <Box className='constructor-input-box box-common'>
                <div className='contents'> 
                  <p>Provide a label for the constructor:</p>
                  <form onSubmit={handleFormSubmit}>
                    <input className="input" type="text" value={formData} onChange={handleInputChange} placeholder="Enter label" required />
                    <div>
                      <button type="submit" className="cancelButton" style={{marginRight:"5px"}}>Submit</button>
                      <button className="cancelButton" onClick={() => handleConstructorCancel()}>Cancel</button>
                    </div>
                  </form>
                </div>
                
              </Box>
            )}

            {errorMessage && (
              <div>
                <Box className='error-message'>
                  <p className='error-text'>{errorMessage}</p>
                  <button className="cancelButton" onClick={()=>handleClearError()}>Okay</button>
                </Box>
              </div>
            )}

            {saveMessage && (
              <div>
                <Box className='save-message'>
                  <p className='save-text'>{saveMessage}</p>
                  <button className="cancelButton" onClick={()=>setSaveMessage(null)}>Okay</button>
                </Box>
              </div>
            )}

            {constructorAdded && (
              <div>
                <Box className='error-message'>
                  <p className='save-text'>Constructor has been successfully saved.</p>
                  <button className= "cancelButton" onClick={()=>setConstructorAdded(false)}>Okay</button>
                </Box>
              </div>
            )}

            {constructorForm && (
              <ConstructorForm
                setConstructorForm={setConstructorForm}
                setAddedNodes={setAddedNodes}
                setAddedEdges={setAddedEdges}
              />
            )}

            {(nodes.length>0 || edges.length>0) && clearNodes &&(
              <Box className='clearBox box-common'>
                <p className='clearBox-text'>Are you sure you want to clear all constructors?</p>
                <div className='clearBox-buttons'>
                  <Button className='clearBox-button' onClick={() => clearAllNodes()}>Confirm</Button>
                  <Button className='clearBox-button' onClick={() => handleClearCancel()}>Cancel</Button>
                </div>
              </Box>
            )}
      </div>
    </ReactFlowProvider>
  );
};

export default ConstructorBuilder;