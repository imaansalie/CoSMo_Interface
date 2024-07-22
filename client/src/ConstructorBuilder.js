import React, {useState } from 'react';
import {Box, Button} from "@chakra-ui/react";
import ReactFlow, {addEdge,Controls,Background,useNodesState,useEdgesState} from 'reactflow';
import 'reactflow/dist/style.css';
import Object from './Nodes/Object';
import ElementSelector from './Nodes/ElementSelector';
import Role from './Edges/Role';
import SubConstructorEdge from './Edges/SubConstructorEdge'
import InstanceEdge from './Edges/InstanceEdge';
import PartOfEdge from './Edges/PartOfEdge';
import InstanceConstructorEdge from './Edges/InstanceConstructorEdge';

const nodeTypes = {
  'Object': Object,
  'Function': Object,
  'ElementSelector': ElementSelector,
  'Arguments': Object,
  'Instance': Object,
  'InstanceConstructor': Object,
  'InstanceConstructor_Connector': Object,
  'IsMandatory': Object,
  'Join': Object,
  'PartOf_Object': Object,
  'PartOf_Type': Object,
  'Property': Object,
  'Role_name': Object,
  'Role': Object,
  'Sub-constructor': Object,
  'TypeConstructor_Connector': Object,
  'TypeConstructor': Object,
  'ValueConstraint': Object,
};

const edgeTypes = {
  'role-edge': Role,
  'subco-edge': SubConstructorEdge,
  'instance-edge': InstanceEdge,
  'part-of-edge': PartOfEdge,
  'instance-co-edge':InstanceConstructorEdge
}

const initialNodes = [
  {
    id:'1',
    type: 'ElementSelector',
    data: {label: 'ElementSelector'},
    position: {x:450, y:25},
  }
];

const initialEdges = [];

export const ConstructorBuilder = () => {
 
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = (params) => setEdges((eds) => addEdge({...params, type:selectedEdgeType}, eds));
  

  const [nodeLabels, setNodeLabels] = useState([]);

  const [selectedEdgeType, setSelectedEdgeType] = useState('role-edge');
  const handleEdgeChange = (event) =>{
    setSelectedEdgeType(event.target.value);
  }

  //Generating text

  const printNodeLabels = () => {
    const labels = nodes.filter(node => node.data.label !== 'ElementSelector').map(node => `Node ID: ${node.id}, Label: ${node.data.label}`);
    setNodeLabels(labels);
  };

  return (
    <div className="FlowTest">
      <h1>Constructor Builder</h1>

      <select value={selectedEdgeType} onChange={handleEdgeChange}>
        <option value='role-edge' > <div className='dropdown-icon'><img src="/icons/Role.png"></img></div> Role </option>
        <option value='subco-edge'> Sub Constructor </option>
        <option value='instance-edge'>Instance Of</option>
        <option value='part-of-edge'>Part Of</option>
        <option value='instance-co-edge'>Instance Constructor</option>
      </select>

      <div className="ConstructorBuilder">
        <Box height={"400px"} width="1000px" border="1px solid gray" className='Builder'>
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
        
        <Button onClick={printNodeLabels} mb={2} className='TextGenerator'>Generate Text</Button>

        <div className='Textbox'>
          {nodeLabels.map((label, index) => (
            <p key={index}>{label}</p>
          ))}
        </div>
          
      </div>
    </div>
    
  );
};
