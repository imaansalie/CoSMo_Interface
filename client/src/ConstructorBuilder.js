import React, {useCallback, useEffect, useState } from 'react';
import {Box, Button} from "@chakra-ui/react";
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

//CoSMo syntax dictionary
const definitions = {
  'TypeConstructor_InstanceConstructor_Connector_Object': (sourceNode, targetNode) => `TypeConstructor:${sourceNode.data.conID}(<br/>`,

  'InstanceConstructor_InstanceConstructor_Connector_Object':(sourceNode, targetNode) => `InstanceConstructor:${sourceNode.data.conID}(<br/>`,

  'InstanceConstructor_Instance_TypeConstructor': (sourceNode, targetNode) => `InstanceOf(${sourceNode.data.conID}, ${targetNode.data.conID})<br/><br/>`,

  'TypeConstructor_Sub-constructor_TypeConstructor': (sourceNode, targetNode) => `SubConstructorOf(${sourceNode.data.conID}, ${targetNode.data.conID})<br/><br/>`,

  'ValueConstraint_Instance_Object':(sourceNode, targetNode) => `${'&nbsp;&nbsp;&nbsp;&nbsp;'}ObjectType(${targetNode.data.itemID})={${sourceNode.data.itemID}}`,

  'InstanceConstructor_PartOf_Object_InstanceConstructor': (sourceNode, targetNode) => `PartOf(${sourceNode.data.conID}, ${targetNode.data.conID})<br/><br/>`,

  'TypeConstructor_PartOf_Object_TypeConstructor': (sourceNode, targetNode) => `PartOf(${sourceNode.data.conID}, ${targetNode.data.conID})<br/><br/>`
}

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

  //array to track function arguments
  const [args, setArgs] = useState([]);
  const [roles, setRoles] = useState([]);
  const [roleIDs, setRoleIDs] = useState([]);

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

  //Generating text

  const printNodesAndConnectors = () => {
    const conIDGroups = new Map();
    let currentRoleID = 0;
    const printedEdges = new Set();

    // console.log(nodes);
    // console.log(edges);

    // console.log("Initial nodes: ", nodes);
    // console.log("Initial edges: ", edges);

    nodes.forEach(node => {
      const conID = node.data.conID;

      if(conID){
        if(!conIDGroups.has(conID)){
          conIDGroups.set(conID, {nodes:[], edges: []});
        }
        conIDGroups.get(conID).nodes.push(node);
      }
    })

    edges.forEach(edge => {
      const sourceNode = nodes.find((node) => node.id === edge.source); //find source node by id
      const targetNode = nodes.find((node) => node.id === edge.target); //find target node by id

      if(sourceNode && targetNode){
        const sourceConID = sourceNode.data.conID;

        if(sourceConID) {
          if(!conIDGroups.has(sourceConID)){
            conIDGroups.set(sourceConID, {nodes: [], edges: []});
          }
          conIDGroups.get(sourceConID).edges.push(edge);
        }
      }
    });

    // console.log("ConID Groups: ", conIDGroups);

    let output = '';

    conIDGroups.forEach((group, conID) =>{
      currentRoleID=0;
      setNextGroup(true);
      console.log("group: ",conID);
      if(group.edges.length >0){
        
        let localRoles = [];
        let localRoleIDs = [];
        let localArgs = [];

        group.edges.forEach((edge, index) => {
          const sourceNode = nodes.find((node) => node.id === edge.source); //find source node by id
          const targetNode = nodes.find((node) => node.id === edge.target); //find target node by id

          if(sourceNode && targetNode){
            const key = `${sourceNode.data.inputType}_${edge.type}_${targetNode.data.inputType}`;
            console.log("key: ",key);
            const edge_string = definitions[key];

            if(key == 'Object_Role_Property' || key == 'Object_IsMandatory_Property' && index< group.edges.length-1){

              localRoles= [];
              localRoleIDs = [];
              localArgs= [];

              // console.log(args);

              if(!localRoles.includes(sourceNode.data.itemID)){
                localRoles.push(sourceNode.data.itemID);
              }

              currentRoleID++;
              localRoleIDs.push('r'+currentRoleID);

              let nextIndex = index+1;
              
              while(nextIndex< group.edges.length){
                const nextEdge = group.edges[nextIndex];
                const nextSourceNode = nodes.find((node) => node.id === nextEdge.source);
                const nextTargetNode = nodes.find((node) => node.id === nextEdge.target);

                if(nextSourceNode && nextTargetNode){
                  const nextKey = `${nextSourceNode.data.inputType}_${nextEdge.type}_${nextTargetNode.data.inputType}`;
                  // console.log(nextKey);

                  if(nextKey === 'Property_Role_Object'){
                    if(!localRoles.includes(nextTargetNode.data.itemID)){
                      localRoles.push(nextTargetNode.data.itemID);
                    }

                    currentRoleID++;
                    localRoleIDs.push('r'+currentRoleID);
                  }
                  else{
                    break;
                  }
                }                
                nextIndex++;
              }

              // console.log(localRoleIDs);
              output+= `${'&nbsp;&nbsp;&nbsp;&nbsp;'}Property(${targetNode.data.itemID}(${localRoleIDs.join(',')})),<br/>`

              localRoles.forEach((role, i) => {
                if(i!==localRoles.length-1){
                  output+=`${'&nbsp;&nbsp;&nbsp;&nbsp;'}${localRoleIDs[i]}:ObjectType(${role}),<br/>`;
                }else{
                  // console.log('in');
                  output+=`${'&nbsp;&nbsp;&nbsp;&nbsp;'}${localRoleIDs[i]}:ObjectType(${role})`;
                }
              })
              
              // console.log(key);
              console.log("array length: ",group.edges.length);
              console.log("next: ",nextIndex);
              if( group.edges.length > nextIndex){
                if(group.edges[nextIndex].type !== 'Role_name'){
                output+=',<br/>';
              }}

              if(key === 'Object_IsMandatory_Property'){
                output += `${'&nbsp;&nbsp;&nbsp;&nbsp;'}isMandatory(r${currentRoleID-1})`;
                if( group.edges.length > index+2){
                  if(group.edges[index+2].type !== 'Role_name'){
                  output+=',<br/>';
                  }
                } 
              }
            } 
            else if (key === 'Object_Role_Arguments' && index<group.edges.length-1){

              if(!localArgs.includes(sourceNode.data.itemID)){
                localArgs.push(sourceNode.data.itemID);
              }

              let nextIndex= index +1;
              while(nextIndex< group.edges.length){
                const nextEdge = group.edges[nextIndex];
                const nextSourceNode = nodes.find((node) => node.id === nextEdge.source);
                const nextTargetNode = nodes.find((node) => node.id === nextEdge.target);

                if(nextSourceNode && nextTargetNode){
                  const nextKey = `${nextSourceNode.data.inputType}_${nextEdge.type}_${nextTargetNode.data.inputType}`;

                  if(nextKey === 'Arguments_Role_Object'){
                    if(!localArgs.includes(nextTargetNode.data.itemID)){
                      localArgs.push(nextTargetNode.data.itemID);
                    }
                    printedEdges.add(nextEdge.id);
                  }

                  else if(nextKey === 'Arguments_Role_Function'){
                    // console.log("Arguments found here: ", args);
                    output+=`${'&nbsp;&nbsp;&nbsp;&nbsp;'}Function(${nextTargetNode.data.itemID}(${localArgs.join(', ')}))`;

                    if(group.edges.length> nextIndex +1 && group.edges[nextIndex+1].type !== 'Role_name'){
                      output+=',<br/>'
                    }
                    break;
                  }
                  else{
                    break;
                  }
                }
                nextIndex++;
              }
            }
            else if (key === 'Join_Join_Property' && index<group.edges.length-1){
              const nextEdge = group.edges[index+1];
              const nextSourceNode = nodes.find((node) => node.id === nextEdge.source);
              const nextTargetNode = nodes.find((node) => node.id === nextEdge.target);

              printedEdges.add(nextEdge.id);

              if(nextSourceNode && nextTargetNode){
                const nextKey = `${nextSourceNode.data.inputType}_${nextEdge.type}_${nextTargetNode.data.inputType}`

                if(nextKey === 'Join_Join_Property'){
                  output += `${'&nbsp;&nbsp;&nbsp;&nbsp;'}Join(${targetNode.data.itemID}, ${nextTargetNode.data.itemID})`
                }

                if( group.edges.length > index+2){
                  if(group.edges[index+2].type !== 'Role_name'){
                  // console.log("length: "+group.edges.length);
                  // console.log("index: "+ index);

                  // console.log(group.edges[index+1].type);
                  output+=',<br/>'
                }
                }
              }
            }
            else if (key === 'Role_name_Role_name_Property'){
              const oldSequence = `r${targetNode.data.roleID-1}:`;
              const newSequence = `r${targetNode.data.roleID-1}[${sourceNode.data.itemID}]:`;

              output=output.replaceAll(oldSequence, newSequence);
            }
            else if(key === 'Property_Role_name_Role_name'){
              const oldSequence = `r${sourceNode.data.roleID}:`;
              const newSequence = `r${sourceNode.data.roleID}[${targetNode.data.itemID}]:`;

              // console.log("in");
              // console.log(oldSequence);
              // console.log(newSequence);

              output=output.replaceAll(oldSequence, newSequence);
            }
            else if (edge_string){
                output += `${edge_string(sourceNode, targetNode)}`;
                printedEdges.add(edge.id);
                if(key === 'ValueConstraint_Instance_Object'){
                  if( group.edges.length >= index+2){
                    output+=',<br/>'
                  }
                }
            }
            if (index === group.edges.length-1 && key!=='InstanceConstructor_Instance_TypeConstructor' && key!=='TypeConstructor_Sub-constructor_TypeConstructor' && key!=='InstanceConstructor_PartOf_Object_InstanceConstructor' && key!=='TypeConstructor_PartOf_Object_TypeConstructor'){
              output+=')<br/><br/>';
            }
          }
        })
      }
    })
    setNodeLabels([output])
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
            <h1>Constructor Builder</h1>

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
              
            <Button onClick={printNodesAndConnectors} mb={2} className='TextGenerator'>Generate Text</Button>

            <div className='Textbox'>
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

          {/* Conditionally render 'SearchForm' based on the new nodeID and current type */}
          {/* If both newNodeId and current type are defined, render the SearchForm component */}
          {/* handleAssign prop called when user selects an item */}
          {/* currentType prop passed to searchForm, determines type of items fetched */}
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
      </div>
    </ReactFlowProvider>
  );
};