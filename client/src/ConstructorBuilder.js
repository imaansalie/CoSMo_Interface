import React, {useEffect, useState } from 'react';
import {Box, Button, Icon} from "@chakra-ui/react";
import ReactFlow, {ReactFlowProvider, addEdge,Controls,Background,useNodesState,useEdgesState} from 'reactflow';
import 'reactflow/dist/style.css';
import Object from './Nodes/Object';
import ElementSelector from './Nodes/ElementSelector';
import Role from './Edges/Role';
import SubConstructorEdge from './Edges/SubConstructorEdge'
import InstanceEdge from './Edges/InstanceEdge';
import PartOfEdge from './Edges/PartOfEdge';
import InstanceConstructorEdge from './Edges/InstanceConstructorEdge';
import InputNode from './Nodes/InputNode';
import IsMandatory from './Edges/IsMandatory';
import JoinEdge from './Edges/JoinEdge';
import Role_name from './Edges/Role_name';
import ValueConstraint from './Edges/ValueConstraint';
import { SearchForm } from './Components/SearchForm';
import { TextGenerator } from './TextGenerator';
import { Settings } from './Components/Settings';
import { ConstructorSaver } from './ConstructorSaver';
import { ConstructorForm } from './Components/ConstructorForm';
import { BsPlusCircle } from 'react-icons/bs';

const nodeTypes = {
  'Object': Object,
  'Function': Object,
  'Arguments': Object,
  'IsMandatory': Object,
  'InstanceConstructor': Object,
  'Join': Object,
  'Property': Object,
  'Role_name': InputNode,
  'TypeConstructor': Object,
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
  {code: "RE", name:"Role", label: "Role"},
  {code: "SCE", name:"Sub-constructor", label: "Sub Constructor Of"},
  {code: "IE", name: "Instance", label: "Instance Of"},
  {code: "POE", name: "PartOf_Object", label: "Part Of"},
  {code: "ICE", name: "InstanceConstructor_Connector", label: "Instance Constructor"},
  {code: "IM", name:"IsMandatory", label: "Is Mandatory"},
  {code: "JO", name: "Join", label: "Join"},
  {code: "RN", name: "Role_name", label: "Role Name Connector"},
  {code: "VC", name: "ValueConstraint", label: "Value Constraint Connector"},
]

const initialNodes = [];
const initialEdges = [];

export const ConstructorBuilder = () => {
 
  //state hooks for nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

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
  const [addedNodes, setAddedNodes] = useState([]);
  const [addedEdges, setAddedEdges] = useState([]);

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

  // load constructor diagram from test folder
  // useEffect(() => {
  //   const loadConstructorData = async () => {
  //     try{
  //       const response = await fetch('./TestFiles/Capybara.txt');

  //       const text= await response.text();
  //       // console.log('raw response: ', text);

  //       const conData = JSON.parse(text);

  //       setNodes(conData.nodes);
  //       setEdges(conData.edges);
  //     } catch (error){
  //       console.error('Error loading data:', error);
  //     }
  //   };

  //   loadConstructorData();
  // }, []);

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
        // console.log("in");
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
  const handleAssign = (item) => {
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
    // console.log(item.itemID);
    setNewNodeId(null);
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
    if(addedNodes.length>0 && addedEdges.length>0){
      setNodes((nds) => [...nds, ...addedNodes]);
      setEdges((eds) => [...eds, ...addedEdges]);
      setAddedNodes([]);
      setAddedEdges([]);
    }
  }, [addedNodes, addedEdges]);

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
          <div className="ConstructorBuilder">
            <h1>Constructor Builder </h1>

            <div className='CB-options'>
              <Settings
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
                nodes={nodes}
                edges={edges}
                setNodeLabels={setNodeLabels}
                setErrorMessage={setErrorMessage}
                setNextGroup={setNextGroup}
                selectedLanguage={selectedLanguage}
              />

              <ConstructorSaver
                nodes={nodes}
                edges={edges}
                nodeLabels={nodeLabels}
                setConstructorAdded= {setConstructorAdded}
                setErrorMessage= {setErrorMessage}
                saveForm={saveForm}
                setSaveForm= {setSaveForm}
              />
            </div>
            

            <div className='Textbox' contentEditable={false}>
                {nodeLabels.length > 0 && (
                <p dangerouslySetInnerHTML={{ __html: nodeLabels[0] }} />
                )}
            </div>
          </div>
          
          <div className='toolbox'>
            <p>Add elements</p>
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
                />  
            </div>
           
            <p>Choose a connector</p>
            <div className='connectors'>
              <ul>
                {connectors.map((connector, index)=>(
                  <li key={index}>
                    <button onClick={() => handleEdgeChange (connector)}>
                      <img src={"/icons/"+connector.name+".png"} className='selector-img'/>
                        <span className='name'>{connector.label}</span>
                    </button>  
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {newNodeId && showSearchForm &&(
          <SearchForm onAssign={handleAssign} itemType={currentType} />
          )}

          {showForm && (
            <Box className='constructor-input-box'>
              <div className='contents'> 
                <p>Provide a label for the constructor:</p>
                <form onSubmit={handleFormSubmit}>
                <input className="input" type="text" value={formData} onChange={handleInputChange} placeholder="Enter label" required />
                <button type="submit">Submit</button>
                </form>
              </div>
              
            </Box>
          )}

          {errorMessage && (
            <div>
              <Box className='error-message'>
                <p className='error-text'>{errorMessage}</p>
                <button onClick={()=>setErrorMessage(null)}>Okay</button>
              </Box>
            </div>
          )}

          {constructorAdded && (
            <div>
              <Box className='error-message'>
                <p className='error-text'>Constructor has been sucessfully saved.</p>
                <button onClick={()=>setConstructorAdded(false)}>Okay</button>
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
      </div>
    </ReactFlowProvider>
  );
};