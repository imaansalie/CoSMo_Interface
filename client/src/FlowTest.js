import React, { useCallback, useState } from 'react';
import {Box, Button, position} from "@chakra-ui/react";
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  MiniMap,
  Controls,
  Background,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import Object from './Nodes/Object';
import ElementSelector from './ElementSelector';
import CustomEdge from './Edges/CustomEdge';
import { animate } from 'framer-motion';
import { Text } from '@chakra-ui/react';


// 
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
  'customEdge': CustomEdge
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

export const FlowTest = () => {
 
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = (params) => setEdges((eds) => addEdge({...params, type:'customEdge'}, eds));

  const [nodeLabels, setNodeLabels] = useState([]);

  const printNodeLabels = () => {
    const labels = nodes.filter(node => node.data.label !== 'ElementSelector').map(node => `Node ID: ${node.id}, Label: ${node.data.label}`);
    setNodeLabels(labels);
  };

  return (
    <div className="ConstructorBuilder">
      <Box height={"400px"} width="1000px" border="1px solid gray" className='Builder'>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          // fitView
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
        >
          {/* <MiniMap /> */}
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
  );
};
