import React, { forwardRef, useEffect, useImperativeHandle} from 'react';
import axios from 'axios';
import { Button } from '@chakra-ui/react';

//CoSMo syntax dictionary

const constructor_definitions = {
    'InstanceConstructor_Instance_TypeConstructor': (sourceNode, targetNode) => `InstanceOf(C${sourceNode.data.conID}, C${targetNode.data.conID})<br/><br/>`,

    'TypeConstructor_Sub-constructor_TypeConstructor': (sourceNode, targetNode) => `SubConstructorOf(C${sourceNode.data.conID}, C${targetNode.data.conID})<br/><br/>`,

    'InstanceConstructor_PartOf_Object_InstanceConstructor': (sourceNode, targetNode) => `PartOf(C${sourceNode.data.conID}, C${targetNode.data.conID})<br/><br/>`,

    'TypeConstructor_PartOf_Object_TypeConstructor': (sourceNode, targetNode) => `PartOf(C${sourceNode.data.conID}, C${targetNode.data.conID})<br/><br/>`,
}

const definitions = {
    'TypeConstructor_InstanceConstructor_Connector_Object': (sourceNode, targetNode) => `TypeConstructor:C${sourceNode.data.conID}(<br/>`,

    'InstanceConstructor_InstanceConstructor_Connector_Object':(sourceNode, targetNode) => `InstanceConstructor:C${sourceNode.data.conID}(<br/>`,

    'ValueConstraint_Instance_Object':(sourceNode, targetNode) => `${'&nbsp;&nbsp;&nbsp;&nbsp;'}ObjectType(${targetNode.data.itemID})={${sourceNode.data.itemID}}`,

    'ValueConstraint_ValueConstraint_Function': (sourceNode, targetNode) => `${'&nbsp;&nbsp;&nbsp;&nbsp;'}Function(${targetNode.data.itemID})={${sourceNode.data.itemID}}`
}
  
const validKeys = [
    {
        edge: 'Role',
        validPairs: ['Object_Property', 'Property_Object', 'Object_Arguments', 'Arguments_Function', 'Arguments_Object'],
        error: 'CoSMo syntax error: Invalid connection for role connector.'
    },
    {
        edge: 'Sub-constructor',
        validPairs: ['TypeConstructor_TypeConstructor'],
        error: 'CoSMo syntax error: Sub Constructor connector can only be used between a Type Constructor and a Type Constructor.'
    },
    {
        edge: 'Instance',
        validPairs: ['InstanceConstructor_TypeConstructor', 'ValueConstraint_Object'],
        error: 'CoSMo syntax error: Instance Of connector can only be used between an Instance Constructor and a Type Constructor, or a Value Constraint and an Object.'
    },
    {
        edge: 'PartOf_Object',
        validPairs: ['TypeConstructor_TypeConstructor', 'InstanceConstructor_InstanceConstructor'],
        error: 'CoSMo syntax error: Part Of connector can only be used between a Type Constructor and a Type Constructor, or an Instance Constructor and an Instance Constructor.'
    },
    {
        edge: 'InstanceConstructor_Connector',
        validPairs: ['InstanceConstructor_Object', 'TypeConstructor_Object'],
        error: 'CoSMo syntax error: Only an object can participate in a relationship with an Instance Constructor or a Type Constructor.'
    },
    {
        edge: 'IsMandatory',
        validPairs: ['Object_Property'],
        error: 'CoSMo syntax error: Is Mandatory connector can only be applied to roles (between an Object and a Property).'
    },
    {
        edge: 'Join',
        validPairs: ['Join_Object', 'Object_Join', 'Join_Property', 'Property_Join'],
        error: 'CoSMo syntax error: Join connector can only be used between the Join element and Objects or Properties.'
    },
    {
        edge: 'Role_name',
        validPairs: ['Role_name_Property', 'Property_Role_name'],
        error: 'CoSMo syntax error: Role names can only be applied to roles (attach to Property).'
    },
    {
        edge: 'ValueConstraint',
        validPairs: ['ValueConstraint_Function'],
        error: 'CoSMo syntax error: Value constraint connectors can only be used between Value Constraints and Functions.'
    },
]

const labels = [
    'ObjectType', 'Object', 'Function', 'InstanceConstructor', 'TypeConstructor', 'Property',  'SubConstructorOf', 'InstanceOf', 'PartOf', 'Join', 'IsMandatory'
]

export const TextGenerator = forwardRef(({nodes, edges, nodeLabels, setNodeLabels, errorMessage, setErrorMessage, setNextGroup, selectedLanguage}, ref) =>{
    let currentRoleID= 0;

    const checkSyntax = (src, edge, tgt) =>{
        const currentEdge = validKeys.find(key => key.edge === edge);
        const pair = `${src}_${tgt}`;
    
        if(currentEdge){
          if(!currentEdge.validPairs.includes(pair)){
            setErrorMessage(currentEdge.error);
          }
        }
    }
    
    const checkNodesForEdges = (nodes) =>{
        nodes.forEach((node) => {
            if(!hasEdges(node.id)){
                setErrorMessage("Every node must have a connector.");
            }
        })
    }
    
    const hasEdges = (nodeID) =>{
        return edges.some((edge) => edge.source === nodeID || edge.target === nodeID);
    }

    const hasTwoConnectors = (nodeID, connectorType, edges) => {

        let isMandEdges =[];

        const matchingEdges = edges.filter(edge => 
            (edge.source === nodeID || edge.target === nodeID) && edge.type === connectorType
        );

        if(connectorType === 'Role'){
            isMandEdges = edges.filter(edge => 
                (edge.source === nodeID || edge.target === nodeID) && edge.type === 'IsMandatory'
            );
        }
        
        // console.log(matchingEdges.length);
        return matchingEdges.length + isMandEdges.length >=2;
    }

    const handleRoles = (key, keys, index, sourceNode, targetNode, currentRoleID, output) => {

        if (!hasTwoConnectors(targetNode.id, 'Role', edges)) {
            setErrorMessage("Properties must have at least two roles.");
            return '';
        }

    
        let localRoles = [];
        let localRoleIDs = [];
        let isMandatory = false;
    
        localRoles.push(sourceNode.data.itemID);
    
        currentRoleID++;
        localRoleIDs.push('r' + currentRoleID);
    
        let nextIndex = index + 1;
    
        if (key === 'Object_IsMandatory_Property') {
            isMandatory = true;
        }
    
        while (nextIndex < keys.length) {
            const nextKey = keys[nextIndex];
    
            if (nextKey.key === 'Property_Role_Object') {
                localRoles.push(nextKey.targetNode.data.itemID);
                currentRoleID++;
                localRoleIDs.push('r' + currentRoleID);
            } else if(nextKey.key === 'Property_Role_name_Role_name'){
                nextIndex++;
                continue;
            }
            else {
                break;
            }
    
            nextIndex++;
        }
    
        output += `${'&nbsp;&nbsp;&nbsp;&nbsp;'}Property(${targetNode.data.itemID}(${localRoleIDs.join(',')})),<br/>`;
    
        localRoles.forEach((role, i) => {
            if (i !== localRoles.length - 1 || isMandatory) {
                output += `${'&nbsp;&nbsp;&nbsp;&nbsp;'}${localRoleIDs[i]}:ObjectType(${role}),<br/>`;
            } else {
                output += `${'&nbsp;&nbsp;&nbsp;&nbsp;'}${localRoleIDs[i]}:ObjectType(${role})`;
            }
        });

        if( keys.length > nextIndex){
            if((keys[nextIndex].edge==='Instance' || keys[nextIndex].edge==='Role') && !constructor_definitions[keys[index+2].key]){
                output+=',<br/>';
            }
        }
    
        if (key === 'Object_IsMandatory_Property') {
            output += `${'&nbsp;&nbsp;&nbsp;&nbsp;'}isMandatory(r${currentRoleID - 1})`;

            if( keys.length > index+2){
                if(keys[index+2].edge !== 'Role_name' && !constructor_definitions[keys[index+2].key]){
                output+=',<br/>';
                }
            } 
        }
    
        return { output, currentRoleID };
    };

    const handleArguments = (keys, index, sourceNode, output) =>{
        let localArgs= [];
        let functionFound= false;
        localArgs.push(sourceNode.data.itemID);
        
        let nextIndex= index +1;

        if(index === keys.length-1){
            setErrorMessage("Arguments must be connected to at least one object and one function.");
            return '';
        }

        while(nextIndex< keys.length){
            const nextKey = keys[nextIndex];

            if(nextKey.key === 'Arguments_Role_Object'){
                if(!localArgs.includes(nextKey.targetNode.data.itemID)){
                    localArgs.push(nextKey.targetNode.data.itemID);
                }
            } else if(nextKey.key === 'Arguments_Role_Function'){

                output+=`${'&nbsp;&nbsp;&nbsp;&nbsp;'}Function(${nextKey.targetNode.data.itemID}(${localArgs.join(', ')}))`;
                nextIndex++;

                while (nextIndex < keys.length && keys[nextIndex].edge === 'ValueConstraint') {
                    output += ',<br/>';
                    nextIndex++;
                }

                functionFound = true;
                break;
            }
            else{
                break;
            }

            nextIndex++;
        }
        
        if(functionFound){
            return output;
        }
        else{
            setErrorMessage("Arguments must be connected to a function.");
            return '';
        }
    }

    const handleJoin = (keys, index, sourceNode, targetNode, output) =>{
        if (!hasTwoConnectors(sourceNode.id, 'Join', edges)) {
            setErrorMessage("Join must be connected to at least two objects or properties.");
        }

        let nextIndex = index+1;

        if(nextIndex < keys.length){
            const nextKey = keys[nextIndex];

            if (nextKey.key === 'Join_Join_Property') {
                // console.log("handling next join");
                if (!hasTwoConnectors(nextKey.sourceNode.id, 'Join', edges)) {
                    setErrorMessage("Join must be connected to at least two objects or properties.");
                }
                output += `${'&nbsp;&nbsp;&nbsp;&nbsp;'}Join(${targetNode.data.itemID}, ${nextKey.targetNode.data.itemID})`

                if (keys.length > index + 2) {
                    if (keys[index + 2].edge !== 'Role_name') {
                        output += ',<br/>'
                    }
                }
            }
        }
        return output;
    }

    const handleRoleName = (key, keys, index, sourceNode, targetNode, output) =>{
        // console.log(currentRoleID);
        if (key === 'Role_name_Role_name_Property') {
            const oldSequence = `r${targetNode.data.roleID - 1}:`;
            // console.log(oldSequence);
            const newSequence = `r${targetNode.data.roleID - 1}[${sourceNode.data.itemID}]:`;
            output = output.replaceAll(oldSequence, newSequence);
        }
        else if (key === 'Property_Role_name_Role_name') {
            const oldSequence = `r${sourceNode.data.roleID}:`;
            // console.log(oldSequence);
            // console.log(`r${sourceNode.data.roleID}:`);
            const newSequence = `r${sourceNode.data.roleID}[${targetNode.data.itemID}]:`;
            output = output.replaceAll(oldSequence, newSequence);
        }

        return output;
    }

    const generateText = () => {
        
        console.log(edges);

        let output = '';
        checkNodesForEdges(nodes);
        let keys = generateTextDFS(nodes, edges);
        // console.log(keys);

        let previousConID = null;
    
        keys.forEach((item, index) => {
            
            const {key, sourceNode, edge, targetNode, conID} = item;
            const edge_string = definitions[key];
            const constructor_string = constructor_definitions[key];

            checkSyntax(sourceNode.data.inputType, edge, targetNode.data.inputType);
            
            if( key === 'Object_Role_Property' || key === 'Object_IsMandatory_Property'){
                //handle roles
                const result= handleRoles(key, keys, index, sourceNode, targetNode, currentRoleID, output);
                output=result.output;
                currentRoleID = result.currentRoleID;
            }
            else if(key === 'Property_Role_Object'){
                if(!hasTwoConnectors(sourceNode.id, 'Role', edges)){
                    setErrorMessage("Property must have at least two roles.")
                }
            }
            else if(key === 'Object_Role_Arguments'){
                //handle arguments
                output = handleArguments(keys, index, sourceNode, output);
            }
            else if(key === 'Join_Join_Property'){
                //handle join
                output = handleJoin(keys, index, sourceNode, targetNode, output);
            }
            else if(key === 'Role_name_Role_name_Property' || key === 'Property_Role_name_Role_name'){
                //handle role name
                output= handleRoleName(key, keys, index, sourceNode, targetNode, output);
            }
            else if(edge_string){
                //handle default types
                output += `${edge_string(sourceNode, targetNode)}`;
                
                if(key.startsWith('ValueConstraint_')){
                    if(index< keys.length-1 && !keys[index+1].key.startsWith('Role_name')){
                        output+=`,<br/>`;
                    }
                }
            }
            else if (constructor_string){
                // console.log(`${constructor_string(sourceNode, targetNode)}`);
                output += `${constructor_string(sourceNode, targetNode)}`;
            }

            if(index+1<keys.length ){
                if(constructor_definitions[keys[index+1].key]){
                    output+= ')<br/><br/>';
                }
            }

            if(previousConID !== null && previousConID !== conID){
                currentRoleID = 0;
                if(!constructor_definitions[key]){
                    output+='blah)<br/><br/>';
                }
            }

            if(index === keys.length -1){
                output+=')<br/><br/>';
            }

            previousConID=conID;
        });
    
        translateOutput(output);
    };

    useImperativeHandle(ref, () => ({
        generateText,
    }));
    
    function generateTextDFS(nodes, edges) {
        const nodeMap = new Map(nodes.map(node => [node.id, node]));
        const edgeMap = new Map(edges.map(edge => [edge.id, edge]));
    
        // Prioritize 'InstanceConstructor' or 'TypeConstructor' nodes with highest y position
        const sortedNodes = [...nodes].sort((a, b) => {
            if (a.data.inputType === 'InstanceConstructor' || a.data.inputType === 'TypeConstructor') {
                if (b.data.inputType === 'InstanceConstructor' || b.data.inputType === 'TypeConstructor') {
                    return b.position.y - a.position.y; // Highest y value first
                }
                return -1; // Prioritize 'InstanceConstructor' or 'TypeConstructor' over other types
            } else if (b.data.inputType === 'InstanceConstructor' || b.data.inputType === 'TypeConstructor') {
                return 1; // Prioritize 'InstanceConstructor' or 'TypeConstructor' over other types
            }
            return b.position.y - a.position.y; // For other nodes, highest y value first
        });

        // Check if there is any 'InstanceConstructor' or 'TypeConstructor' node
        const hasStartingNode = nodes.some(
            node => node.data.inputType === 'InstanceConstructor' || node.data.inputType === 'TypeConstructor'
        );

        if (!hasStartingNode) {
            setErrorMessage("CoSMo syntax error: All CoSMo constructors must start with an 'InstanceConstructor' or 'TypeConstructor'.");
            return []; // Return an empty result or handle this case as needed
        }
    
        const result = [];
        const visited = new Set();
    
        function dfs(nodeId) {
            if (visited.has(nodeId)) return;
            visited.add(nodeId);
    
            const node = nodeMap.get(nodeId);
            const nodeType = node.data.inputType;
            const outgoingEdges = Array.from(edgeMap.values())
                .filter(edge => edge.source === nodeId);
    
            const sortedEdges = outgoingEdges.sort((a, b) => {
                const targetA = nodeMap.get(a.target);
                const targetB = nodeMap.get(b.target);
                return targetA.position.x - targetB.position.x;
            });
    
            for (const edge of sortedEdges) {
                const targetNode = nodeMap.get(edge.target);
                const edgeType = edge.type;
                const targetType = targetNode.data.inputType;
                const key = `${nodeType}_${edgeType}_${targetType}`;
    
                result.push({ key, sourceNode: node, edge: edge.type, targetNode, conID: node.data.conID });
    
                dfs(edge.target);
            }
        }
    
        // Start DFS from all nodes, but prioritized
        for (const node of sortedNodes) {
            if (!visited.has(node.id)) {
                dfs(node.id);
            }
        }

        // Sort the result by conID
        result.sort((a, b) => a.conID - b.conID);
    
        return result;
    }
    
    //handle first layer of multilingualism

    const translateOutput = async(output) =>{
        console.log('translating...');
        for(let label of labels){
            if(output.includes(label)){
                try{
                    const newLabel = await findLabel(label);

                    output = output.replaceAll(label, newLabel);
                }catch(error){
                    console.error("Error fetching label: ", error);
                }
            }
        }
        setNodeLabels([output]);
        // console.log(nodeLabels);
    }

    const findLabel = async (label) =>{
        try{
            const response = await axios.post('http://localhost:3001/getLabel', {label, selectedLanguage});
            const column = `${selectedLanguage}`
            const responseData= response.data[0];
            // console.log(responseData);
            return responseData[column];
        } catch (error){
             console.error("Error getting items: ", error);
             throw error;
        }
    }

    
    //testing
    useEffect(() => {
        // Attach generateText to the window object
        if (typeof window !== 'undefined') {
          window.generateText = generateText;
        //   console.log("Generate Text function attached to window.");
        }
    
        // Clean up
        return () => {
          if (typeof window !== 'undefined') {
            delete window.generateText;
          }
        };
      }, [nodes, edges]);

    return(
        <div>
            <Button onClick={()=>generateText()} className='TextGenerator'>Generate Text</Button>
        </div>
    )
})

