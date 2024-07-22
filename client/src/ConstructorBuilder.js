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

const edgeTypes = {
  'Role': Role,
  'Sub-constructor': SubConstructorEdge,
  'Instance': InstanceEdge,
  'PartOf_Object': PartOfEdge,
  'InstanceConstructor_Connector':InstanceConstructorEdge
}

const connectors = [
  {code: "RE", name:"Role"},
  {code: "SCE", name:"Sub-constructor"},
  {code: "IE", name: "Instance"},
  {code: "POE", name: "PartOf_Object"},
  {code: "ICE", name: "InstanceConstructor_Connector"},
]

const initialNodes = [];
const initialEdges = [];

export const ConstructorBuilder = () => {
 
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = (params) => setEdges((eds) => addEdge({...params, type:selectedEdgeType}, eds));

  const [nodeLabels, setNodeLabels] = useState([]);

  const [selectedEdgeType, setSelectedEdgeType] = useState('Role');

  //setting edge type
  const handleEdgeChange = (connector) =>{
    setSelectedEdgeType(connector.name);
    // console.log(connector.name)
  }

  //Generating text

  const printNodeLabels = () => {
    const labels = nodes.filter(node => node.data.label !== 'ElementSelector').map(node => `Node ID: ${node.id}, Label: ${node.data.label}`);
    setNodeLabels(labels);
  };

  return (
    <ReactFlowProvider>
        <div className="FlowTest">
          <div className="ConstructorBuilder">
            <h1>Constructor Builder</h1>

            {/* <select value={selectedEdgeType} onChange={handleEdgeChange}>
              <option value='role-edge' > <div className='dropdown-icon'><img src="/icons/Role.png"></img></div> Role </option>
              <option value='subco-edge'> Sub Constructor </option>
              <option value='instance-edge'>Instance Of</option>
              <option value='part-of-edge'>Part Of</option>
              <option value='instance-co-edge'>Instance Constructor</option>
            </select> */}

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
          
          <div className='toolbox'>
            <div className='elements'>
              <ElementSelector/>  
            </div>
           
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

      </div>
    </ReactFlowProvider>
  );
};
