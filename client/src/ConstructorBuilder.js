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
]

//CoSMo syntax dictionary
const definitions = {
  'TypeConstructor_InstanceConstructor_Connector_Object': (sourceNode, targetNode) => `<br/>TypeConstructor:${sourceNode.data.conID}(<br/>`,

  'InstanceConstructor_InstanceConstructor_Connector_Object':(sourceNode, targetNode) => `InstanceConstructor:${sourceNode.data.conID}(<br/>`,

  'InstanceConstructor_Instance_TypeConstructor': (sourceNode, targetNode) => `<br/>InstanceOf(${sourceNode.data.conID}, ${targetNode.data.conID})<br/><br/>`,

  'TypeConstructor_Sub-constructor_TypeConstructor': (sourceNode, targetNode) => `<br/>SubConstructorOf(${sourceNode.data.conID}, ${targetNode.data.conID})`,

  'ValueConstraint_Instance_Object':(sourceNode, targetNode) => `${'&nbsp;&nbsp;&nbsp;&nbsp;'}ObjectType(${targetNode.data.itemID})={${sourceNode.data.itemID}})`
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

  const showSearchForm = currentType==='Property' || currentType === 'Object' || currentType === 'Role_name'|| currentType === 'ValueConstraint' || currentType === 'Function';

  const [conMap, setConMap] = useState(new Map());

  //handles adding edges (connectors) to between nodes using the selected edge type
  const onConnect = (params) => {
    const sourceNode = nodes.find((node) => node.id === params.source);
    const targetNode = nodes.find((node) => node.id === params.target); 

    if(sourceNode && targetNode){ //check if both source node and target node exist

      const updatedConID = sourceNode.data.conID;
      setEdges((eds) => addEdge({...params, type:selectedEdgeType}, eds)); //add edge

      //update conID of node -- ensures that all elements connected to some constructor can be tracked
      if(targetNode.data.inputType !== 'TypeConstructor' && targetNode.data.inputType !== 'InstanceConstructor'){ 
        updateNodeConID(params.target, updatedConID);
      }

      updateConMap(updatedConID, sourceNode, targetNode);
    
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

  //track all nodes according to their inherited conID
  const updateConMap = (conID, sourceNode, targetNode) =>{
    setConMap((prevMap) =>{
      const newMap = new Map (prevMap);

      if(newMap.has(conID)){
        const nodesArray = new Set(newMap.get(conID));
        nodesArray.add(sourceNode);
        nodesArray.add(targetNode);
        newMap.set(conID, Array.from(nodesArray));
      }
      else{
        newMap.set(conID, [sourceNode, targetNode]);
      }
      return newMap;
    })
  }

  const printAllItems = () =>{
    conMap.forEach((nodes, conID) =>{
     console.log(`ConID: ${conID}`);

     if(Array.isArray(nodes)){
       nodes.forEach(node =>{
      console.log(`Node ID ${node.id}, Input Type: ${node.data.inputType}`);
      })
     } else {
      console.error(`Expect an array but got:`, nodes);
     }
    
    })
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

    // conIDGroups.forEach((group, conID) => {
    //   console.log(`ConID: ${conID}`);
    //   console.log('Nodes:', group.nodes);
    //   console.log('Edges:', group.edges);
    // })

    let output = '';

    conIDGroups.forEach((group, conID) =>{
      // let previousKey = null;

      if(group.edges.length >0){
        
        group.edges.forEach((edge, index) => {
          const sourceNode = nodes.find((node) => node.id === edge.source); //find source node by id
          const targetNode = nodes.find((node) => node.id === edge.target); //find target node by id

          if(sourceNode && targetNode){
            const key = `${sourceNode.data.inputType}_${edge.type}_${targetNode.data.inputType}`;
            console.log(`${conID}: `+key);
            const edge_string = definitions[key];

            if(key == 'Object_Role_Property' && index< group.edges.length-1){
              const nextEdge = group.edges[index+1];
              const nextSourceNode = nodes.find((node) => node.id === nextEdge.source);
              const nextTargetNode = nodes.find((node) => node.id === nextEdge.target);

              if(nextSourceNode && nextTargetNode){
                const nextKey = `${nextSourceNode.data.inputType}_${nextEdge.type}_${nextTargetNode.data.inputType}`

                // console.log(nextKey);

                if(nextKey === 'Property_Role_Object'){
                  output += `${'&nbsp;&nbsp;&nbsp;&nbsp;'}Property(${targetNode.data.itemID}(r1,r2)),<br/>
                  ${'&nbsp;&nbsp;&nbsp;&nbsp;'}r1:ObjectType(${sourceNode.data.itemID}),<br/>
                  ${'&nbsp;&nbsp;&nbsp;&nbsp;'}r2:ObjectType(${nextTargetNode.data.itemID})`;

                  // previousKey = key;

                }
              }
            } else if (key === 'Object_Role_Arguments' && index<group.edges.length-1){
                const nextEdge = group.edges[index+1];
                const nextSourceNode = nodes.find((node) => node.id === nextEdge.source);
                const nextTargetNode = nodes.find((node) => node.id === nextEdge.target);

                if(nextSourceNode && nextTargetNode){
                  const nextKey = `${nextSourceNode.data.inputType}_${nextEdge.type}_${nextTargetNode.data.inputType}`
  
                  if(nextKey === 'Arguments_Role_Function'){
                    output += `${'&nbsp;&nbsp;&nbsp;&nbsp;'}Function(${nextTargetNode.data.itemID} (${sourceNode.data.itemID}))`;

                    // previousKey=key;
                  }
                }
            } else if (edge_string){
                output += `${edge_string(sourceNode, targetNode)}`;

                // previousKey=null;
            }
          }
        })
        output+=')<br/>';
      }
    })
    setNodeLabels([output])
  };

  //check if constructor has been deleted
  const handleNodeDelete = (inputType, nodeId) =>{
    if (inputType === 'InstanceConstructor' || inputType === 'TypeConstructor') {
      // console.log("deleted");
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