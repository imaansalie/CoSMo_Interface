//CoSMo syntax dictionary
const definitions = {
    'TypeConstructor_InstanceConstructor_Connector_Object': (sourceNode, targetNode) => `TypeConstructor:${sourceNode.data.conID}(<br/>`,

    'InstanceConstructor_InstanceConstructor_Connector_Object':(sourceNode, targetNode) => `InstanceConstructor:${sourceNode.data.conID}(<br/>`,

    'InstanceConstructor_Instance_TypeConstructor': (sourceNode, targetNode) => `InstanceOf(${sourceNode.data.conID}, ${targetNode.data.conID})<br/><br/>`,

    'TypeConstructor_Sub-constructor_TypeConstructor': (sourceNode, targetNode) => `SubConstructorOf(${sourceNode.data.conID}, ${targetNode.data.conID})<br/><br/>`,

    'ValueConstraint_Instance_Object':(sourceNode, targetNode) => `${'&nbsp;&nbsp;&nbsp;&nbsp;'}ObjectType(${targetNode.data.itemID})={${sourceNode.data.itemID}}`,

    'InstanceConstructor_PartOf_Object_InstanceConstructor': (sourceNode, targetNode) => `PartOf(${sourceNode.data.conID}, ${targetNode.data.conID})<br/><br/>`,

    'TypeConstructor_PartOf_Object_TypeConstructor': (sourceNode, targetNode) => `PartOf(${sourceNode.data.conID}, ${targetNode.data.conID})<br/><br/>`
}
  
const validKeys = [
    {
        edge: 'Role',
        validPairs: ['Object_Property', 'Property_Object', 'Object_Arguments', 'Arguments_Function', 'Arguments_Object'],
        error: 'Invalid connection for role connector.'
    },
    {
        edge: 'Sub-constructor',
        validPairs: ['TypeConstructor_TypeConstructor'],
        error: 'Only a Type Constructor can be a sub constructor of a Type Constructor.'
    },
    {
        edge: 'Instance',
        validPairs: ['InstanceConstructor_TypeConstructor', 'ValueConstraint_Object'],
        error: 'Only a Type Constructor can be an instance of an Instance Constructor.'
    },
    {
        edge: 'PartOf_Object',
        validPairs: ['TypeConstructor_TypeConstructor', 'InstanceConstructor_InstanceConstructor'],
        error: 'A Type Constructor can only be part of a Type Constructor, and an Instance Constructor can only be part of an Instance Constructor.'
    },
    {
        edge: 'InstanceConstructor_Connector',
        validPairs: ['InstanceConstructor_Object', 'TypeConstructor_Object'],
        error: 'Only an object can participate in a relationship with an Instance Constructor or a Type Constructor.'
    },
    {
        edge: 'IsMandatory',
        validPairs: ['Object_Property'],
        error: 'Is Mandatory connector can only be applied to roles (between an Object and a Property).'
    },
    {
        edge: 'Join',
        validPairs: ['Join_Object', 'Object_Join', 'Join_Property', 'Property_Join'],
        error: 'Join connector can only be used between Objects or Properties.'
    },
    {
        edge: 'Role_name',
        validPairs: ['Role_name_Property', 'Property_Role_name'],
        error: 'Role names can only be applied to roles (attach to Property).'
    },
    {
        edge: 'ValueConstraint',
        validPairs: ['ValueConstraint_Function'],
        error: 'Value constraint connectors can only be used between Value Constraints and Functions.'
    },
]

export const TextGenerator = (nodes, edges, setNodeLabels, setErrorMessage, setNextGroup) =>{

    const conIDGroups = new Map();
    let currentRoleID = 0;
    const printedEdges = new Set();

    const checkSyntax = (src, edge, tgt) =>{
        const currentEdge = validKeys.find(key => key.edge === edge);
        // console.log("given edge: ", edge);
        const pair = `${src}_${tgt}`;
        // console.log("pair: ",pair);
    
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

    const handleRoles = (group, nodes, index, sourceNode, targetNode, currentRoleID, output, key) =>{
        
        let localRoles= [];
        let localRoleIDs = [];

        localRoles.push(sourceNode.data.itemID);

        currentRoleID++;
        localRoleIDs.push('r'+currentRoleID);

        let nextIndex = index + 1;

        if(index === group.edges.length-1){
            setErrorMessage("Properties must have at least two roles.");
            return '';
        }

        while(nextIndex< group.edges.length){
            const nextEdge = group.edges[nextIndex];
            const nextSourceNode = nodes.find((node) => node.id === nextEdge.source);
            const nextTargetNode = nodes.find((node) => node.id === nextEdge.target);

            if(nextSourceNode && nextTargetNode){
                const nextKey = `${nextSourceNode.data.inputType}_${nextEdge.type}_${nextTargetNode.data.inputType}`;
                console.log("next: ",nextKey);

                if(nextKey === 'Property_Role_Object'){
                    localRoles.push(nextTargetNode.data.itemID);
                    currentRoleID++;
                    localRoleIDs.push('r'+currentRoleID);
                }
                else{
                    break;
                }
            }                
            nextIndex++;
        }
        // console.log(localRoleIDs);
        output+= `${'&nbsp;&nbsp;&nbsp;&nbsp;'}Property(${targetNode.data.itemID}(${localRoleIDs.join(',')})),<br/>`

        localRoles.forEach((role, i) => {
            if(i!==localRoles.length-1){
                output+=`${'&nbsp;&nbsp;&nbsp;&nbsp;'}${localRoleIDs[i]}:ObjectType(${role}),<br/>`;
            }else{
                // console.log('in');
                output+=`${'&nbsp;&nbsp;&nbsp;&nbsp;'}${localRoleIDs[i]}:ObjectType(${role})`;
            }
        })
        
        if( group.edges.length > nextIndex){
            if(group.edges[nextIndex].type !== 'Role_name'){
            output+=',<br/>';
        }}

        if(key === 'Object_IsMandatory_Property'){
            output += `${'&nbsp;&nbsp;&nbsp;&nbsp;'}isMandatory(r${currentRoleID-1})`;
            if( group.edges.length > index+2){
                if(group.edges[index+2].type !== 'Role_name'){
                output+=',<br/>';
                }
            } 
        }

        return output;
    }

    const handleArguments = (group, nodes, index, sourceNode, targetNode, currentRoleID, output) =>{
        let localArgs= [];
        let functionFound= false;
        localArgs.push(sourceNode.data.itemID);
        
        let nextIndex= index +1;

        if(index === group.edges.length-1){
            setErrorMessage("Arguments must be connected to at least one object and one function.");
            return '';
        }

        while(nextIndex< group.edges.length){
            const nextEdge = group.edges[nextIndex];
            const nextSourceNode = nodes.find((node) => node.id === nextEdge.source);
            const nextTargetNode = nodes.find((node) => node.id === nextEdge.target);

            if(nextSourceNode && nextTargetNode){
                const nextKey = `${nextSourceNode.data.inputType}_${nextEdge.type}_${nextTargetNode.data.inputType}`;

                if(nextKey === 'Arguments_Role_Object'){
                    if(!localArgs.includes(nextTargetNode.data.itemID)){
                        localArgs.push(nextTargetNode.data.itemID);
                    }
                    printedEdges.add(nextEdge.id);
                }

                else if(nextKey === 'Arguments_Role_Function'){
                    // console.log("Arguments found here: ", args);
                    output+=`${'&nbsp;&nbsp;&nbsp;&nbsp;'}Function(${nextTargetNode.data.itemID}(${localArgs.join(', ')}))`;

                    if(group.edges.length> nextIndex +1 && group.edges[nextIndex+1].type !== 'Role_name'){
                        output+=',<br/>'
                    }

                    functionFound = true;
                    break;
                }
                else{
                    break;
                }
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

    let output = '';

    conIDGroups.forEach((group, conID) =>{
        currentRoleID=0;
        setNextGroup(true);

        if(group.nodes.length>0){
            checkNodesForEdges(nodes);
        }
        
        if(group.edges.length >0){            
            group.edges.forEach((edge, index) => {
                const sourceNode = nodes.find((node) => node.id === edge.source); //find source node by id
                const targetNode = nodes.find((node) => node.id === edge.target); //find target node by id

                if(sourceNode && targetNode){
                const key = `${sourceNode.data.inputType}_${edge.type}_${targetNode.data.inputType}`;
                console.log("key: ",key);
                
                checkSyntax(sourceNode.data.inputType, edge.type, targetNode.data.inputType);

                const edge_string = definitions[key];

                if(key == 'Object_Role_Property' || key == 'Object_IsMandatory_Property'){
                    output= handleRoles(group, nodes, index, sourceNode, targetNode, currentRoleID, output, key);
                } 
                else if (key === 'Object_Role_Arguments'){
                    output= handleArguments(group, nodes, index, sourceNode, targetNode, currentRoleID, output);
                }
                else if (key === 'Join_Join_Property' && index<group.edges.length-1){
                    const nextEdge = group.edges[index+1];
                    const nextSourceNode = nodes.find((node) => node.id === nextEdge.source);
                    const nextTargetNode = nodes.find((node) => node.id === nextEdge.target);

                    printedEdges.add(nextEdge.id);

                    if(nextSourceNode && nextTargetNode){
                        const nextKey = `${nextSourceNode.data.inputType}_${nextEdge.type}_${nextTargetNode.data.inputType}`

                        if(nextKey === 'Join_Join_Property'){
                            output += `${'&nbsp;&nbsp;&nbsp;&nbsp;'}Join(${targetNode.data.itemID}, ${nextTargetNode.data.itemID})`
                        }

                        if( group.edges.length > index+2){
                            if(group.edges[index+2].type !== 'Role_name'){
                            output+=',<br/>'
                            }
                        }
                    }
                }
                else if (key === 'Role_name_Role_name_Property'){
                    const oldSequence = `r${targetNode.data.roleID-1}:`;
                    const newSequence = `r${targetNode.data.roleID-1}[${sourceNode.data.itemID}]:`;
                    output=output.replaceAll(oldSequence, newSequence);
                }
                else if(key === 'Property_Role_name_Role_name'){
                    const oldSequence = `r${sourceNode.data.roleID}:`;
                    const newSequence = `r${sourceNode.data.roleID}[${targetNode.data.itemID}]:`;
                    output=output.replaceAll(oldSequence, newSequence);
                }
                else if (edge_string){
                    output += `${edge_string(sourceNode, targetNode)}`;
                    printedEdges.add(edge.id);
                    if(key === 'ValueConstraint_Instance_Object'){
                        if( group.edges.length >= index+2){
                        output+=',<br/>'
                        }
                    }
                }
                if (index === group.edges.length-1 && 
                    key!=='InstanceConstructor_Instance_TypeConstructor' && key!=='TypeConstructor_Sub-constructor_TypeConstructor' && key!=='InstanceConstructor_PartOf_Object_InstanceConstructor' && key!=='TypeConstructor_PartOf_Object_TypeConstructor' && output !== ''){
                    output+=')<br/><br/>';
                }
                }
            })
        }
    })
    setNodeLabels([output]);

    return(
        <div>
            update
        </div>
    )
}

