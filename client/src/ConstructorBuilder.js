
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
import AdornmentIconSelector from './Nodes/AdornmentIconSelector';
import IsMandatory from './Edges/IsMandatory';
import JoinEdge from './Edges/JoinEdge';
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
  'Join': JoinEdge
}

const connectors = [
  {code: "RE", name:"Role", label: "Role"},
  {code: "SCE", name:"Sub-constructor", label: "Sub Constructor Of"},
  {code: "IE", name: "Instance", label: "Instance Of"},
  {code: "POE", name: "PartOf_Object", label: "Part Of"},
  {code: "ICE", name: "InstanceConstructor_Connector", label: "Instance Constructor"},
  {code: "IM", name:"IsMandatory", label: "Is Mandatory"},
  {code: "JO", name: "Join", label: "Join"},
  {code: "ARG", name: "Role", label: "Argument"}
]

//CoSMo syntax dictionary
const definitions = {
  'TypeConstructor_InstanceConstructor_Connector_Object': (sourceNode, targetNode) => `<br/>TypeConstructor:${sourceNode.data.conID}(`,
  'InstanceConstructor_InstanceConstructor_Connector_Object':(sourceNode, targetNode) => `InstanceConstructor:${sourceNode.data.conID}(`,
  'InstanceConstructor_Instance_TypeConstructor': (sourceNode, targetNode) => `<br/>InstanceOf(${sourceNode.data.conID}, ${targetNode.data.conID})<br/>`,
  'TypeConstructor_Sub-constructor_TypeConstructor': (sourceNode, targetNode) => `<br/>SubConstructorOf(${sourceNode.data.conID}, ${targetNode.data.conID})`,
  'ValueConstraint_Instance_Object':(sourceNode, targetNode) => `${'&nbsp;&nbsp;&nbsp;&nbsp;'}ObjectType(${targetNode.data.itemID})={${sourceNode.data.itemID}})`
}

const initialNodes = [];
const initialEdges = [];

export const ConstructorBuilder = () => {
 
  //state hooks for nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  //handles adding edges (connectors) to between nodes using the selected edge type
  const onConnect = (params) => setEdges((eds) => addEdge({...params, type:selectedEdgeType}, eds));

  //state hook for text generator string
  const [nodeLabels, setNodeLabels] = useState([]);

  const [selectedEdgeType, setSelectedEdgeType] = useState('Role');
  const [newNodeId, setNewNodeId] = useState(null);
  const [currentType, setCurrentType] = useState(null);
  const [checkDeleted, setCheckDeleted] = useState(false);

  const showSearchForm = currentType==='Property' || currentType === 'Object' || currentType === 'Role_name'|| currentType === 'ValueConstraint' || currentType === 'Function';

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
    console.log(item.itemID);
    setNewNodeId(null);
  };

  //Generating text

  const printNodesAndConnectors = () => {

    const edgeDetails =[];

    edges.forEach((edge, index) => {
      const sourceNode = nodes.find((node) => node.id === edge.source); //find source node by id
      const targetNode = nodes.find((node) => node.id === edge.target); //find target node by id

      if(sourceNode && targetNode){
        //for each edge, create a string describing the source node, edge type and target node

        const key= `${sourceNode.data.inputType}_${edge.type}_${targetNode.data.inputType}`;
        console.log(key);
        const edge_string = definitions[key];
        
        if(edge_string){
          edgeDetails.push(edge_string(sourceNode, targetNode));
        }

        if(key === 'Object_Role_Property' && index < edges.length -1){
          const nextEdge = edges[index +1];
          const nextSourceNode = nodes.find((node) => node.id === nextEdge.source);
          const nextTargetNode = nodes.find((node) => node.id === nextEdge.target);

          if(nextSourceNode && nextTargetNode){
            const nextKey = `${nextSourceNode.data.label}_${nextEdge.type}_${nextTargetNode.data.label}`

            if(nextKey === 'Property_Role_Object'){
              edgeDetails.push(
                `${'&nbsp;&nbsp;&nbsp;&nbsp;'}Property(${targetNode.data.itemID}(r1,r2)),<br/>
                ${'&nbsp;&nbsp;&nbsp;&nbsp;'}r1:ObjectType(${sourceNode.data.itemID}),<br/>
                ${'&nbsp;&nbsp;&nbsp;&nbsp;'}r2:ObjectType(${nextTargetNode.data.itemID})
                `
              )
            }
          }
        }
        if(key === 'Object_Role_Arguments' && index < edges.length -1){
          const nextEdge = edges[index +1];
          const nextSourceNode = nodes.find((node) => node.id === nextEdge.source);
          const nextTargetNode = nodes.find((node) => node.id === nextEdge.target);

          if(nextSourceNode && nextTargetNode){
            const nextKey = `${nextSourceNode.data.label}_${nextEdge.type}_${nextTargetNode.data.label}`

            if(nextKey === 'Arguments_Role_Function'){
              edgeDetails.push(
                `${'&nbsp;&nbsp;&nbsp;&nbsp;'}Function(${nextTargetNode.data.itemID} (${sourceNode.data.itemID}))<br/>
                `
              )
            }
          }
        }
        // else{
        //   edgeDetails.push(`Source Node: ${sourceNode ? sourceNode.data.label : 'Unknown'}, Edge Type: ${edge.type}, Target Node: ${targetNode ? targetNode.data.label : 'Unknown'}`);
        // }
      }
    });
      
    //combine all edge detail strings into one with a break in between
    const formattedString = edgeDetails.join('<br/>');

    //update the state with the formatted string
    setNodeLabels([formattedString]);
  };

  //check if constructor has been deleted
  const handleNodeDelete = (inputType, nodeId) =>{
    if (inputType === 'InstanceConstructor' || inputType === 'TypeConstructor') {
      console.log("deleted");
      setCheckDeleted(true);
    }

    setEdges((prevEdges) => prevEdges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId))
  }

  //after informing element selector, reset checkDeleted boolean to true after 1 second
  useEffect(() =>{
    if(checkDeleted){
      setTimeout(() =>setCheckDeleted(false), 1000);
    }
  }, [checkDeleted]);

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
            <div className='elements'>
              <ElementSelector 
                setCurrentType={setCurrentType} 
                setNewNodeId={setNewNodeId}
                elementDeleted={checkDeleted}
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
      </div>
    </ReactFlowProvider>
  );
};