import React, {useState } from 'react';
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
  'ElementSelector': ElementSelector,
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
 
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = (params) => setEdges((eds) => addEdge({...params, type:selectedEdgeType}, eds));

  const [nodeLabels, setNodeLabels] = useState([]);
  const [selectedEdgeType, setSelectedEdgeType] = useState('Role');
  // const [isFormVisible, setIsFormVisible] = useState(false);
  const [newNodeId, setNewNodeId] = useState(null);
  const [currentType, setCurrentType] = useState(null);

  //setting edge type
  const handleEdgeChange = (connector) =>{
    setSelectedEdgeType(connector.name);
    // console.log(connector.name)
  }

  // assign selected data item to node
  const handleAssign = (item) => {
    //update state of nodes
    setNodes((prevNodes) =>
      //check each node
      prevNodes.map((node) =>
        //check if node ID matches newNodeID
        node.id === newNodeId ? { 
          //create a new node object with updated data
          ...node, 
          data: { 
            //copy the existing data
            ...node.data, 
            //update the label
            label: item.itemID }
          } 
          : node //if it doesn't match, return the node as is
      ),
    );
    setNewNodeId(null);
    console.log(item.item);
    console.log(newNodeId);
    // setIsFormVisible(false);
  };

  //Generating text

  const printNodeLabels = () => {
    const labels = nodes
      .filter(node => node.data.label !== 'ElementSelector')
      .map(node => `${node.data.inputType}: ${node.id} -- ${node.data.label}`);

    const formattedString = labels.join(', \n');

    setNodeLabels([formattedString]);
  };

  const printNodesAndConnectors = () => {
    const edgeDetails = edges.map((edge) => {
      const sourceNode = nodes.find((node) => node.id === edge.source);
      const targetNode = nodes.find((node) => node.id === edge.target);

      return `Source Node: ${sourceNode ? sourceNode.data.label : 'Unknown'}, Edge Type: ${edge.type}, Target Node: ${targetNode ? targetNode.data.label : 'Unknown'}`;
    });

    const formattedString = edgeDetails.join('<br />');
    setNodeLabels([formattedString]);
  };

  return (
    <ReactFlowProvider>
        <div className="FlowTest">
          <div className="ConstructorBuilder">
            <h1>Constructor Builder</h1>

            <Box border="1px solid gray" className='Builder'>
                <ReactFlow
                  nodes={nodes}
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
              <ElementSelector setCurrentType={setCurrentType} setNewNodeId={setNewNodeId}/>  
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
          {newNodeId && currentType && (
          <SearchForm onAssign={handleAssign} itemType={currentType} />
          )}
      </div>
    </ReactFlowProvider>
  );
};
