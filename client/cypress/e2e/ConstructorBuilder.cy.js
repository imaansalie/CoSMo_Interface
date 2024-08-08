describe('ConstructorBuilder Tests', () => {
  beforeEach(() => {
    cy.visit('/ConstructorBuilder'); // Adjust the URL to where your component is rendered
  });

  it('should add nodes and edges and verify generated text', () => {
    cy.get('.FlowTest').should('be.visible');

    // Add nodes and edges
    cy.window().then((win) => {
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

      // Call the custom method to add nodes and edges
      win.addNodesAndEdges(nodes, edges);

      // Continue with your test assertions
      cy.wait(2000); // Wait for the state to update

      // Call generateText and check the results
      cy.window().then((win) => {
        if (typeof win.generateText === 'function') {
          win.generateText(); // Call the function
        } else {
          throw new Error("Generate Text function is not available");
        }
      });

      cy.wait(10000); // Adjust time as needed to allow for async operations

      cy.get('.Textbox p').should(($p) => {
        const text = $p.html(); // Get the HTML content
        expect(text).to.contain('TypeConstructor:C5(<br>)<br><br>');
      });
    });
  });
});
