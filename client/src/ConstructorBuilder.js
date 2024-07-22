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
  'IsMandatory': Object,
  'InstanceConstructor': Object,
  'Join': Object,
  'Property': Object,
  'Role_name': Object,
  'TypeConstructor': Object,
  'ValueConstraint': Object,
};

const elements =[
  {code:"Ob", name:"Object"},
  {code:"Func", name:"Function"},
  {code:"Arg", name:"Arguments"},
  {code:"InstCo", name:"InstanceConstructor"},
  {code:"Man", name:"IsMandatory"},
  {code:"Join", name:"Join"},
  {code:"Prop", name:"Property"},
  {code:"RN", name:"Role_name"},
  {code:"TC1", name:"TypeConstructor"},
  {code:"VC", name:"ValueConstraint"},
];

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

//  const onElementClick= ({name}) =>{
//   const x= Math.random() * 100;
//       const y= Math.random() * 100;

//       setNodes( (prevNodes) => [
//           ...prevNodes, 
//           {
//               id: generateUniqueId(), 
//               data: {label:name }, 
//               type: `${name}`,
//               position: {x:x, y:y},
//           },
//       ]);     
      
//       console.log(`Added node: ${name} with ID ${generateUniqueId}`);
//  }

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
      

      <div className="ConstructorBuilder">
        <h1>Constructor Builder</h1>

        <select value={selectedEdgeType} onChange={handleEdgeChange}>
          <option value='role-edge' > <div className='dropdown-icon'><img src="/icons/Role.png"></img></div> Role </option>
          <option value='subco-edge'> Sub Constructor </option>
          <option value='instance-edge'>Instance Of</option>
          <option value='part-of-edge'>Part Of</option>
          <option value='instance-co-edge'>Instance Constructor</option>
        </select>

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
      
      <div className='toolbox-elements'></div>
          <li>
            
          </li>

    </div>
    
  );
};
