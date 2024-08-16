import { render, screen, act, fireEvent } from '@testing-library/react';
import ConstructorBuilder from './ConstructorBuilder';
import { MockUserContextProvider } from '../test.utils';
import React from 'react';
import '@testing-library/jest-dom';
import axios from 'axios';

jest.mock('axios');

// Mock ResizeObserver and other global objects
class ResizeObserver {
    constructor(callback) {
        this.callback = callback;
    }

    observe(target) {
        this.callback([{ target }], this);
    }

    unobserve() {}
    disconnect() {}
}

global.ResizeObserver = ResizeObserver;

class DOMMatrixReadOnly {
    constructor(transform) {
        const scale = transform?.match(/scale\(([1-9.]+)\)/)?.[1];
        this.m22 = scale !== undefined ? +scale : 1;
    }
}

global.DOMMatrixReadOnly = DOMMatrixReadOnly;

Object.defineProperties(global.HTMLElement.prototype, {
    offsetHeight: {
        get() {
            return parseFloat(this.style.height) || 1;
        },
    },
    offsetWidth: {
        get() {
            return parseFloat(this.style.width) || 1;
        },
    },
});

global.SVGElement.prototype.getBBox = () => ({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
});

// Mock setNodes and setEdges
const mockSetNodes = jest.fn();
const mockSetEdges = jest.fn();

// Mock the components used in ConstructorBuilder
// jest.mock('./TextGenerator', () => ({
//     TextGenerator: ({ nodes, edges, setNodeLabels }) => {
//       // Simulate text generation based on nodes and edges
//       const generatedText = nodes.length > 0 ? `TypeConstructor:C5(<br/><br/><br/>)` : '';
//       act(() => {
//         setNodeLabels([generatedText]);
//       });
//       return <div className="Textbox" dangerouslySetInnerHTML={{ __html: generatedText }} />;
//     },
//   }));
  
//   jest.mock('reactflow', () => {
//   const originalModule = jest.requireActual('reactflow');

//   return {
//     ...originalModule,
//     useNodesState: jest.fn(() => [[], jest.fn(), jest.fn()]),
//     useEdgesState: jest.fn(() => [[], jest.fn(), jest.fn()]),
//     ReactFlowProvider: ({ children }) => children,
//     ReactFlow: ({ children }) => <div>{children}</div>,
//   };
// });

// Mock React Flow hooks
jest.mock('reactflow', () => {
    const actual = jest.requireActual('reactflow');
    return {
        ...actual,
        ReactFlow: ({ children, nodes, edges, onNodesChange, onEdgesChange, onConnect, nodeTypes, edgeTypes }) => (
            <div>
                <div>Nodes: {JSON.stringify(nodes)}</div>
                <div>Edges: {JSON.stringify(edges)}</div>
                {children}
            </div>
        ),
        Controls: () => <div>Controls</div>,
        Background: () => <div>Background</div>,
        useNodesState: jest.fn(() => [[], jest.fn(), jest.fn()]),
        useEdgesState: jest.fn(() => [[], jest.fn(), jest.fn()]),
    };
});

describe('ConstructorBuilder', () => {
    it('generates the correct text based on React Flow nodes and edges', async () => {
        // Mock the API response for label translation
        axios.post.mockResolvedValue({
            data: [{ selectedLanguage: 'translatedLabel' }],
        });

        // Simulate adding nodes and edges
        const nodes = [
            {
                id: 'node_fsxeln3qv',
                data: {
                    label: 'Type Constructor',
                    inputType: 'TypeConstructor',
                    picture: 'TypeConstructor',
                    itemLabel: 'test',
                    conID: 5,
                    itemID: '',
                    roleID: null
                },
                type: 'TypeConstructor',
                position: {
                    x: 84.37,
                    y: 30.40
                },
                width: 133,
                height: 121,
                positionAbsolute: {
                    x: 84.37,
                    y: 30.40
                }
            },
            {
                id: 'node_6u78vmrbg',
                data: {
                    label: 'Object',
                    inputType: 'Object',
                    picture: 'Object',
                    itemLabel: 'parent',
                    conID: 5,
                    itemID: 'Q7566',
                    roleID: null
                },
                type: 'Object',
                position: {
                    x: 317.09,
                    y: 55.99
                },
                width: 163,
                height: 71,
                selected: true,
                positionAbsolute: {
                    x: 317.09,
                    y: 55.99
                },
                dragging: false
            }
        ];

        const edges = [
            {
                source: 'node_fsxeln3qv',
                sourceHandle: 'source-right',
                target: 'node_6u78vmrbg',
                targetHandle: 'target-left',
                type: 'InstanceConstructor_Connector',
                id: 'reactflow__edge-node_fsxeln3qvsource-right-node_6u78vmrbgtarget-left'
            }
        ];

        screen.debug(); 

        // Mock implementation of hooks
        require('reactflow').useNodesState.mockImplementation(() => [nodes, jest.fn(), jest.fn()]);
        require('reactflow').useEdgesState.mockImplementation(() => [edges, jest.fn(), jest.fn()]);

        // Render the component with mocked setNodes and setEdges
        const {container} =render(
            <MockUserContextProvider>
                <ConstructorBuilder/>
            </MockUserContextProvider>
        );

        // Simulate clicking the generate text button
        const generateTextButton = screen.getByText(/Generate Text/i);
        await act(async () => {
            fireEvent.click(generateTextButton);
        });

        // Log the container's outer HTML to inspect the structure
        console.log(container.innerHTML);

        // Attempt to select the element with the correct selector
        const generatedText = container.querySelector('.Textbox'); // Update with the correct selector
        if (generatedText) {
            expect(generatedText.innerHTML).toContain('TypeConstructor:C5(<br/><br/><br/>)'); // Adjust the expected content as needed
        } else {
            throw new Error('Element with the specified selector was not found.');
        }
    });
});
