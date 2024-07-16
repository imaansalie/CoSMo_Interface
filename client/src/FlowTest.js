import React, { useCallback, useState } from 'react';
import {Box, position} from "@chakra-ui/react";
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
import Function from './Nodes/Function';
import ElementSelector from './ElementSelector';
import CustomEdge from './Edges/CustomEdge';
import { animate } from 'framer-motion';

const nodeTypes = {
  'Object': Object,
  'Function': Function,
  'ElementSelector': ElementSelector
};

const edgeTypes = {
  'customEdge': CustomEdge
}

const initialNodes = [
  {
    id:'1',
    type: 'ElementSelector',
    data: {label: 'ElementSelector'},
    position: {x:250, y:100},
  }
];

const initialEdges = [];

export const FlowTest = () => {
 
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = (params) => setEdges((eds) => addEdge({...params, type:'customEdge'}, eds));

  return (
    <div className="ConstructorBuilder">
      <Box height={"500px"} width="1000px" border="1px solid black">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
        >
          {/* <MiniMap /> */}
          <Controls />
          <Background />
        </ReactFlow>
      </Box>
      <div className='Textbox'>
        <p>Text generated here</p>
      </div>
    </div>
  );
};
