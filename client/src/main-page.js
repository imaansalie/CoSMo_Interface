import React, {useState} from 'react';
import {DragDropContext, Droppable, Draggable} from '@hello-pangea/dnd';

const finalElements = [
    {
        id: 'obj',
        name: 'Object',
        thumb: "/icons/Object.png"
    },
    {
        id: 'func',
        name: 'Function',
        thumb: '/icons/Function.png'
    },
    {
        id: 'prop',
        name: 'Property',
        thumb: '/icons/Property.png'
    },
    {
        id: 'type',
        name: 'Type Constructor',
        thumb: '/icons/TypeConstructor.png'
    },
    {
        id: 'inst1',
        name: 'Instance Constructor',
        thumb: '/icons/InstanceConstructor.png'
    },
    {
        id: 'sub',
        name: 'Sub Constructor',
        thumb: '/icons/Sub-constructor.png'
    },
    {
        id: 'inst2',
        name: 'Instance Of',
        thumb: '/icons/Instance.png'
    },
    {
        id: 'role',
        name: 'Role',
        thumb: '/icons/Role.png'
    },
    {
        id: 'PO1',
        name: 'Part Of (Type)',
        thumb: '/icons/PartOf_Type.png'
    },
    {
        id: 'PO2',
        name: 'Part Of (Object)',
        thumb: '/icons/PartOf_Object.png'
    },
    {
        id: 'conn1',
        name: 'Type Constructor Connector',
        thumb: '/icons/TypeConstructor_Connector.png'
    },
    {
        id: 'conn2',
        name: 'Instance Constructor Connector',
        thumb: '/icons/InstanceConstructor_Connector.png'
    },
    {
        id: 'VC',
        name: 'Value Constraint',
        thumb: '/icons/ValueConstraint.png'
    },
    {
        id: 'RN',
        name: 'Role Name',
        thumb: '/icons/Role_name.png'
    },
    {
        id: 'join',
        name: 'Join',
        thumb: '/icons/Join.png'
    },
    {
        id: 'mand',
        name: 'Is Mandatory',
        thumb: '/icons/IsMandatory.png'
    }
]

export const Main = () =>{
    const [elements, updateElements] = useState(finalElements)

    function handleOnDragEnd(result){
        if(!result.destination) return;
        const items= Array.from(elements); //create copy array
        const [reorderedItem]=items.splice(result.source.index, 1); //use splice to find original index and store value
        items.splice(result.destination.index, 0, reorderedItem); //find destination index and inject moved item

        updateElements(items);
    }
    return (
        <div className ="Main">
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <div className='editor'>
                    <p>Drop elements here.</p>
                </div>
                <Droppable droppableId="elements">
                    {(provided) => (
                        <ul className="tools" {...provided.droppableProps} ref={provided.innerRef}>
                        {elements.map(({id, name, thumb}, index) =>{
                            return (
                                <Draggable key={id} draggableId={id} index={index}>
                                    {(provided) => (
                                        <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} >
                                            <div className="tools-thumb">
                                                <img src={thumb} alt={`${name} Thumb`}/>
                                            </div>
                                            <div class="label">{name}</div>
                                        </li>
                                    )}
                                </Draggable>
                            );
                        })}
                        </ul>
                    )} 
                </Droppable>
            </DragDropContext>
        </div>
    );
};
