
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
  {code: "RE", name:"Role"},
  {code: "SCE", name:"Sub-constructor"},
  {code: "IE", name: "Instance"},
  {code: "POE", name: "PartOf_Object"},
  {code: "ICE", name: "InstanceConstructor_Connector"},
  {code: "IM", name:"IsMandatory"},
  {code: "JO", name: "Join"}
]

const initialNodes = [];
const initialEdges = [];

export const ConstructorBuilder = () => {
 
  //state hooks for nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  //handles adding edges (connectors) to between nodes using the selected edge type
  const onConnect = (params) => setEdges((eds) => addEdge({...params, type:selectedEdgeType}, eds));

  const [nodeLabels, setNodeLabels] = useState([]);
  const [selectedEdgeType, setSelectedEdgeType] = useState('Role');
  const [newNodeId, setNewNodeId] = useState(null);
  const [currentType, setCurrentType] = useState(null);
  const [checkDeleted, setCheckDeleted] = useState(false);


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
            label: item.itemID }//update the label
          } 
          : node //if it doesn't match, return the node as is
      ),
    );
    setNewNodeId(null);
  };

  //Generating text

  const printNodesAndConnectors = () => {
    const edgeDetails = edges.map((edge) => { //iterate over each edge in edges array
      const sourceNode = nodes.find((node) => node.id === edge.source); //find source node by id
      const targetNode = nodes.find((node) => node.id === edge.target); //find target node by id

      //for each edge, create a string describing the source node, edge type and target node
      return `Source Node: ${sourceNode ? sourceNode.data.label : 'Unknown'}, Edge Type: ${edge.type}, Target Node: ${targetNode ? targetNode.data.label : 'Unknown'}`;
    });

    //combine all edge detail strings into one with a break in between
    const formattedString = edgeDetails.join('<br />');

    //update the state with the formatted string
    setNodeLabels([formattedString]);
  };

  const handleNodeDelete = (inputType) =>{
    if (inputType === 'InstanceConstructor' || inputType === 'TypeConstructor') {
      console.log("deleted");
      setCheckDeleted(true);
    }
  }

  useEffect(() =>{
    if(checkDeleted){
      setTimeout(() =>setCheckDeleted(false), 1000);
    }
  }, [checkDeleted]);

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
                      <span className='name'>{connector.name}</span>
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
          {newNodeId && currentType && (
          <SearchForm onAssign={handleAssign} itemType={currentType} />
          )}
      </div>
    </ReactFlowProvider>
  );
};