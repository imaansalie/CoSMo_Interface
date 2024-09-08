describe('ConstructorBuilder Tests', () => {

    beforeEach(() => {
        cy.intercept('POST', 'http://localhost:3001/getConstructors', {
            fixture: 'constructors.json', 
          }).as('getConstructors');

        // Visit the login page 
        cy.visit('/'); 
    
        // Fill out the login form
        cy.get('input[placeholder="Enter username..."]').type('test1'); 
        cy.get('input[placeholder="Enter password..."]').type('123'); 
    
        // Submit the form
        cy.get('button').contains('Log in').click();
    
        // Wait for navigation
        cy.url().should('include', '/ConstructorManager');

        // Wait for the constructors to load after login
        cy.wait('@getConstructors');

        //simulate navigating to ConstructorBuilder using Navbar
    
        cy.get('.Sidebar').should('be.visible');
        cy.get('.SidebarList .Sidebar-row') 
        .contains('Constructor Builder') 
        .click();

        cy.url().should('include', '/ConstructorBuilder');
      });

  //test a basic constructor

  it('should add a constructor of type "TypeConstructor" and verify text', () => {
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
      cy.wait(1000); // Wait for the state to update

      // Call generateText and check the results
      cy.window().then((win) => {
        if (typeof win.generateText === 'function') {
          win.generateText(); // Call the function
        } else {
          throw new Error("Generate Text function is not available");
        }
      });

      cy.wait(1000); // Adjust time as needed to allow for async operations

      cy.get('.Textbox p').should(($p) => {
        const text = $p.html(); // Get the HTML content
        expect(text).to.contain('TypeConstructor:C5(<br>)<br><br>');
      });
    });
  });

  //testing adding an element to the editor

  it('should add a node of type "Object" and assign a data item to it',()=>{
    cy.get('.FlowTest').should('be.visible');

    cy.get('button').contains('Object').click();
    cy.get('button').contains('Greece').click();

    cy.get('.Builder').contains('Q41').should('exist');
  })

  //testing dynamic properties

  it('should add a constructor with a property and two roles, and verify text', () => {
    cy.get('.FlowTest').should('be.visible');

    // Add nodes and edges
    cy.window().then((win) => {
      const nodes = [
        {
            "id": "node_trkl9crmg",
            "data": {
                "label": "Object",
                "inputType": "Object",
                "picture": "Object",
                "itemLabel": "parent",
                "conID": 5,
                "itemID": "Q7566",
                "roleID": null
            },
            "type": "Object",
            "position": {
                "x": 57.49466152898985,
                "y": 81.53507997283415
            },
            "width": 163,
            "height": 71,
            "positionAbsolute": {
                "x": 57.49466152898985,
                "y": 81.53507997283415
            }
        },
        {
            "id": "node_xi0vtxb2a",
            "data": {
                "label": "Type Constructor",
                "inputType": "TypeConstructor",
                "picture": "TypeConstructor",
                "itemLabel": "test",
                "conID": 5,
                "itemID": "",
                "roleID": null
            },
            "type": "TypeConstructor",
            "position": {
                "x": -138.50437519441243,
                "y": 54.79430460017673
            },
            "width": 133,
            "height": 121,
            "selected": false,
            "positionAbsolute": {
                "x": -138.50437519441243,
                "y": 54.79430460017673
            },
            "dragging": false
        },
        {
            "id": "node_wdy0lsqtu",
            "data": {
                "label": "Two Roles",
                "inputType": "Property",
                "picture": "Property",
                "itemLabel": "child",
                "conID": 5,
                "itemID": "P40",
                "roleID": 2
            },
            "type": "Property",
            "position": {
                "x": 280.84999739875855,
                "y": 91.35007814328958
            },
            "width": 133,
            "height": 48,
            "selected": false,
            "positionAbsolute": {
                "x": 280.84999739875855,
                "y": 91.35007814328958
            },
            "dragging": false
        },
        {
            "id": "node_oyk6l0ast",
            "data": {
                "label": "Object",
                "inputType": "Object",
                "picture": "Object",
                "itemLabel": "child",
                "conID": 5,
                "itemID": "Q29514218",
                "roleID": null
            },
            "type": "Object",
            "position": {
                "x": 468.0328316108391,
                "y": 78.33026397027524
            },
            "width": 163,
            "height": 71,
            "selected": true,
            "positionAbsolute": {
                "x": 468.0328316108391,
                "y": 78.33026397027524
            },
            "dragging": false
          }
        ];
      const edges = [
        {
            "source": "node_xi0vtxb2a",
            "sourceHandle": "source-right",
            "target": "node_trkl9crmg",
            "targetHandle": "target-left",
            "type": "InstanceConstructor_Connector",
            "id": "reactflow__edge-node_xi0vtxb2asource-right-node_trkl9crmgtarget-left"
        },
        {
            "source": "node_trkl9crmg",
            "sourceHandle": "source-right",
            "target": "node_wdy0lsqtu",
            "targetHandle": "target-left",
            "type": "Role",
            "id": "reactflow__edge-node_trkl9crmgsource-right-node_wdy0lsqtutarget-left"
        },
        {
            "source": "node_wdy0lsqtu",
            "sourceHandle": "source-right",
            "target": "node_oyk6l0ast",
            "targetHandle": "target-left",
            "type": "Role",
            "id": "reactflow__edge-node_wdy0lsqtusource-right-node_oyk6l0asttarget-left"
        }
    ];

      // Call the custom method to add nodes and edges
      win.addNodesAndEdges(nodes, edges);

      // Continue with your test assertions
      cy.wait(1000); // Wait for the state to update

      // Call generateText and check the results
      cy.window().then((win) => {
        if (typeof win.generateText === 'function') {
          win.generateText(); // Call the function
        } else {
          throw new Error("Generate Text function is not available");
        }
      });

      cy.wait(1000); // Adjust time as needed to allow for async operations

      cy.get('.Textbox p').should(($p) => {
        const text = $p.html(); // Get the HTML content
        expect(text).to.contain('TypeConstructor:C5(<br>&nbsp;&nbsp;&nbsp;&nbsp;Property(P40(r1,r2)),<br>&nbsp;&nbsp;&nbsp;&nbsp;r1:ObjectType(Q7566),<br>&nbsp;&nbsp;&nbsp;&nbsp;r2:ObjectType(Q29514218))<br><br>');
      });
    });
  });

  it('should add a constructor with a property and three roles, and verify text', () => {
    cy.get('.FlowTest').should('be.visible');

    // Add nodes and edges
    cy.window().then((win) => {
      const nodes = [
        {
            "id": "node_xi0vtxb2a",
            "data": {
                "label": "Type Constructor",
                "inputType": "TypeConstructor",
                "picture": "TypeConstructor",
                "itemLabel": "test",
                "conID": 5,
                "itemID": "",
                "roleID": null
            },
            "type": "TypeConstructor",
            "position": {
                "x": -138.50437519441243,
                "y": 54.79430460017673
            },
            "width": 133,
            "height": 121,
            "selected": false,
            "positionAbsolute": {
                "x": -138.50437519441243,
                "y": 54.79430460017673
            },
            "dragging": false
        },
        {
            "id": "node_d63h61bll",
            "data": {
                "label": "Object",
                "inputType": "Object",
                "picture": "Object",
                "itemLabel": "Greece",
                "conID": 5,
                "itemID": "Q41",
                "roleID": null
            },
            "type": "Object",
            "position": {
                "x": 60.34938049925694,
                "y": 76.96693818868022
            },
            "width": 163,
            "height": 71,
            "selected": false,
            "positionAbsolute": {
                "x": 60.34938049925694,
                "y": 76.96693818868022
            },
            "dragging": false
        },
        {
            "id": "node_fz6fyru2c",
            "data": {
                "label": "Three Roles",
                "inputType": "Property",
                "picture": "Property_3",
                "itemLabel": "part of",
                "conID": 5,
                "itemID": "P361",
                "roleID": 2
            },
            "type": "Property",
            "position": {
                "x": 276.41801524205164,
                "y": 93.31944099274776
            },
            "width": 153,
            "height": 38,
            "selected": false,
            "positionAbsolute": {
                "x": 276.41801524205164,
                "y": 93.31944099274776
            },
            "dragging": false
        },
        {
            "id": "node_nn9mfl01j",
            "data": {
                "label": "Object",
                "inputType": "Object",
                "picture": "Object",
                "itemLabel": "region",
                "conID": 5,
                "itemID": "Q82794",
                "roleID": null
            },
            "type": "Object",
            "position": {
                "x": 272.4838496306278,
                "y": -39.062599086111305
            },
            "width": 163,
            "height": 71,
            "selected": false,
            "positionAbsolute": {
                "x": 272.4838496306278,
                "y": -39.062599086111305
            },
            "dragging": false
        },
        {
            "id": "node_fgt8bgsn3",
            "data": {
                "label": "Object",
                "inputType": "Object",
                "picture": "Object",
                "itemLabel": "location",
                "conID": 5,
                "itemID": "Q17334923",
                "roleID": null
            },
            "type": "Object",
            "position": {
                "x": 494.1498388529916,
                "y": 77.77043739024333
            },
            "width": 163,
            "height": 71,
            "selected": true,
            "positionAbsolute": {
                "x": 494.1498388529916,
                "y": 77.77043739024333
            },
            "dragging": false
        }
    ];
      const edges = [
        {
            "source": "node_xi0vtxb2a",
            "sourceHandle": "source-right",
            "target": "node_d63h61bll",
            "targetHandle": "target-left",
            "type": "InstanceConstructor_Connector",
            "id": "reactflow__edge-node_xi0vtxb2asource-right-node_d63h61blltarget-left"
        },
        {
            "source": "node_d63h61bll",
            "sourceHandle": "source-right",
            "target": "node_fz6fyru2c",
            "targetHandle": "target-left",
            "type": "Role",
            "id": "reactflow__edge-node_d63h61bllsource-right-node_fz6fyru2ctarget-left"
        },
        {
            "source": "node_fz6fyru2c",
            "sourceHandle": "source-top",
            "target": "node_nn9mfl01j",
            "targetHandle": "target-bottom",
            "type": "Role",
            "id": "reactflow__edge-node_fz6fyru2csource-top-node_nn9mfl01jtarget-bottom"
        },
        {
            "source": "node_fz6fyru2c",
            "sourceHandle": "source-right",
            "target": "node_fgt8bgsn3",
            "targetHandle": "target-left",
            "type": "Role",
            "id": "reactflow__edge-node_fz6fyru2csource-right-node_fgt8bgsn3target-left"
        }
    ];

      // Call the custom method to add nodes and edges
      win.addNodesAndEdges(nodes, edges);

      // Continue with your test assertions
      cy.wait(1000); // Wait for the state to update

      // Call generateText and check the results
      cy.window().then((win) => {
        if (typeof win.generateText === 'function') {
          win.generateText(); // Call the function
        } else {
          throw new Error("Generate Text function is not available");
        }
      });

      cy.wait(1000); // Adjust time as needed to allow for async operations

      cy.get('.Textbox p').should(($p) => {
        const text = $p.html(); // Get the HTML content
        expect(text).to.contain('TypeConstructor:C5(<br>&nbsp;&nbsp;&nbsp;&nbsp;Property(P361(r1,r2,r3)),<br>&nbsp;&nbsp;&nbsp;&nbsp;r1:ObjectType(Q41),<br>&nbsp;&nbsp;&nbsp;&nbsp;r2:ObjectType(Q82794),<br>&nbsp;&nbsp;&nbsp;&nbsp;r3:ObjectType(Q17334923))<br><br>');
      });
    });
  });

  it('should add a constructor with a property and four roles, and verify text', () => {
    cy.get('.FlowTest').should('be.visible');

    // Add nodes and edges
    cy.window().then((win) => {
      const nodes = [
        {
            "id": "node_xi0vtxb2a",
            "data": {
                "label": "Type Constructor",
                "inputType": "TypeConstructor",
                "picture": "TypeConstructor",
                "itemLabel": "test",
                "conID": 5,
                "itemID": "",
                "roleID": null
            },
            "type": "TypeConstructor",
            "position": {
                "x": -138.50437519441243,
                "y": 54.79430460017673
            },
            "width": 133,
            "height": 121,
            "selected": false,
            "positionAbsolute": {
                "x": -138.50437519441243,
                "y": 54.79430460017673
            },
            "dragging": false
        },
        {
            "id": "node_zp93fwe75",
            "data": {
                "label": "Object",
                "inputType": "Object",
                "picture": "Object",
                "itemLabel": "Albert Einstein",
                "conID": 5,
                "itemID": "Q9960",
                "roleID": null
            },
            "type": "Object",
            "position": {
                "x": 71.49152008095683,
                "y": 80.9258505249409
            },
            "width": 163,
            "height": 71,
            "selected": false,
            "positionAbsolute": {
                "x": 71.49152008095683,
                "y": 80.9258505249409
            },
            "dragging": false
        },
        {
            "id": "node_x8aui59bc",
            "data": {
                "label": "Four Roles",
                "inputType": "Property",
                "picture": "Property_4",
                "itemLabel": "father",
                "conID": 5,
                "itemID": "P22",
                "roleID": 2
            },
            "type": "Property",
            "position": {
                "x": 312.6470347953374,
                "y": 100.60851920593495
            },
            "width": 173,
            "height": 33,
            "selected": false,
            "positionAbsolute": {
                "x": 312.6470347953374,
                "y": 100.60851920593495
            },
            "dragging": false
        },
        {
            "id": "node_6d9zv30yp",
            "data": {
                "label": "Object",
                "inputType": "Object",
                "picture": "Object",
                "itemLabel": "child",
                "conID": 5,
                "itemID": "Q29514218",
                "roleID": null
            },
            "type": "Object",
            "position": {
                "x": 571.1066000862521,
                "y": 79.29113095963271
            },
            "width": 163,
            "height": 71,
            "selected": false,
            "positionAbsolute": {
                "x": 571.1066000862521,
                "y": 79.29113095963271
            },
            "dragging": false
        },
        {
            "id": "node_9jasq0ljc",
            "data": {
                "label": "Object",
                "inputType": "Object",
                "picture": "Object",
                "itemLabel": "Douglas Adams",
                "conID": 5,
                "itemID": "Q42 ",
                "roleID": null
            },
            "type": "Object",
            "position": {
                "x": 206.8334587049324,
                "y": -43.12906985920952
            },
            "width": 163,
            "height": 71,
            "selected": false,
            "positionAbsolute": {
                "x": 206.8334587049324,
                "y": -43.12906985920952
            },
            "dragging": false
        },
        {
            "id": "node_65io4oo4z",
            "data": {
                "label": "Object",
                "inputType": "Object",
                "picture": "Object",
                "itemLabel": "Edith Eger",
                "conID": 5,
                "itemID": "Q62070381",
                "roleID": null
            },
            "type": "Object",
            "position": {
                "x": 394.12658171804594,
                "y": 185.13916166778938
            },
            "width": 163,
            "height": 71,
            "selected": true,
            "positionAbsolute": {
                "x": 394.12658171804594,
                "y": 185.13916166778938
            },
            "dragging": false
        }
    ];
      const edges = [
        {
            "source": "node_xi0vtxb2a",
            "sourceHandle": "source-right",
            "target": "node_zp93fwe75",
            "targetHandle": "target-left",
            "type": "InstanceConstructor_Connector",
            "id": "reactflow__edge-node_xi0vtxb2asource-right-node_zp93fwe75target-left"
        },
        {
            "source": "node_zp93fwe75",
            "sourceHandle": "source-right",
            "target": "node_x8aui59bc",
            "targetHandle": "target-left",
            "type": "Role",
            "id": "reactflow__edge-node_zp93fwe75source-right-node_x8aui59bctarget-left"
        },
        {
            "source": "node_x8aui59bc",
            "sourceHandle": "source-right",
            "target": "node_6d9zv30yp",
            "targetHandle": "target-left",
            "type": "Role",
            "id": "reactflow__edge-node_x8aui59bcsource-right-node_6d9zv30yptarget-left"
        },
        {
            "source": "node_x8aui59bc",
            "sourceHandle": "source-top",
            "target": "node_9jasq0ljc",
            "targetHandle": "target-bottom",
            "type": "Role",
            "id": "reactflow__edge-node_x8aui59bcsource-top-node_9jasq0ljctarget-bottom"
        },
        {
            "source": "node_x8aui59bc",
            "sourceHandle": "source-bottom",
            "target": "node_65io4oo4z",
            "targetHandle": "target-top",
            "type": "Role",
            "id": "reactflow__edge-node_x8aui59bcsource-bottom-node_65io4oo4ztarget-top"
        }
    ];

      // Call the custom method to add nodes and edges
      win.addNodesAndEdges(nodes, edges);

      // Continue with your test assertions
      cy.wait(1000); // Wait for the state to update

      // Call generateText and check the results
      cy.window().then((win) => {
        if (typeof win.generateText === 'function') {
          win.generateText(); // Call the function
        } else {
          throw new Error("Generate Text function is not available");
        }
      });

      cy.wait(1000); // Adjust time as needed to allow for async operations

      cy.get('.Textbox p').should(($p) => {
        const text = $p.html(); // Get the HTML content
        expect(text).to.contain('TypeConstructor:C5(<br>&nbsp;&nbsp;&nbsp;&nbsp;Property(P22(r1,r2,r3,r4)),<br>&nbsp;&nbsp;&nbsp;&nbsp;r1:ObjectType(Q9960),<br>&nbsp;&nbsp;&nbsp;&nbsp;r2:ObjectType(Q42 ),<br>&nbsp;&nbsp;&nbsp;&nbsp;r3:ObjectType(Q62070381),<br>&nbsp;&nbsp;&nbsp;&nbsp;r4:ObjectType(Q29514218))<br><br>');
      });
    });
  });

  it('should add a constructor with a property and five roles, and verify text', () => {
    cy.get('.FlowTest').should('be.visible');

    // Add nodes and edges
    cy.window().then((win) => {
      const nodes = [
        {
            "id": "node_xi0vtxb2a",
            "data": {
                "label": "Type Constructor",
                "inputType": "TypeConstructor",
                "picture": "TypeConstructor",
                "itemLabel": "test",
                "conID": 5,
                "itemID": "",
                "roleID": null
            },
            "type": "TypeConstructor",
            "position": {
                "x": -138.50437519441243,
                "y": 54.79430460017673
            },
            "width": 133,
            "height": 121,
            "selected": false,
            "positionAbsolute": {
                "x": -138.50437519441243,
                "y": 54.79430460017673
            },
            "dragging": false
        },
        {
            "id": "node_zp93fwe75",
            "data": {
                "label": "Object",
                "inputType": "Object",
                "picture": "Object",
                "itemLabel": "Albert Einstein",
                "conID": 5,
                "itemID": "Q9960",
                "roleID": null
            },
            "type": "Object",
            "position": {
                "x": 71.49152008095683,
                "y": 80.9258505249409
            },
            "width": 163,
            "height": 71,
            "selected": false,
            "positionAbsolute": {
                "x": 71.49152008095683,
                "y": 80.9258505249409
            },
            "dragging": false
        },
        {
            "id": "node_6d9zv30yp",
            "data": {
                "label": "Object",
                "inputType": "Object",
                "picture": "Object",
                "itemLabel": "child",
                "conID": 5,
                "itemID": "Q29514218",
                "roleID": null
            },
            "type": "Object",
            "position": {
                "x": 639.1066000862521,
                "y": 79.29113095963271
            },
            "width": 163,
            "height": 71,
            "selected": false,
            "positionAbsolute": {
                "x": 639.1066000862521,
                "y": 79.29113095963271
            },
            "dragging": false
        },
        {
            "id": "node_9jasq0ljc",
            "data": {
                "label": "Object",
                "inputType": "Object",
                "picture": "Object",
                "itemLabel": "Douglas Adams",
                "conID": 5,
                "itemID": "Q42 ",
                "roleID": null
            },
            "type": "Object",
            "position": {
                "x": 206.8334587049324,
                "y": -43.12906985920952
            },
            "width": 163,
            "height": 71,
            "selected": false,
            "positionAbsolute": {
                "x": 206.8334587049324,
                "y": -43.12906985920952
            },
            "dragging": false
        },
        {
            "id": "node_65io4oo4z",
            "data": {
                "label": "Object",
                "inputType": "Object",
                "picture": "Object",
                "itemLabel": "Edith Eger",
                "conID": 5,
                "itemID": "Q62070381",
                "roleID": null
            },
            "type": "Object",
            "position": {
                "x": 394.12658171804594,
                "y": 185.13916166778938
            },
            "width": 163,
            "height": 71,
            "selected": false,
            "positionAbsolute": {
                "x": 394.12658171804594,
                "y": 185.13916166778938
            },
            "dragging": false
        },
        {
            "id": "node_dcyvktr84",
            "data": {
                "label": "Five Roles",
                "inputType": "Property",
                "picture": "Property_5",
                "itemLabel": "father",
                "conID": 5,
                "itemID": "P22",
                "roleID": 2
            },
            "type": "Property",
            "position": {
                "x": 348.1460959147638,
                "y": 112.31874409340747
            },
            "width": 173,
            "height": 30,
            "selected": true,
            "positionAbsolute": {
                "x": 348.1460959147638,
                "y": 112.31874409340747
            },
            "dragging": false
        },
        {
            "id": "node_427vemybj",
            "data": {
                "label": "Object",
                "inputType": "Object",
                "picture": "Object",
                "itemLabel": "science fiction writer",
                "conID": 5,
                "itemID": "Q18844224",
                "roleID": null
            },
            "type": "Object",
            "position": {
                "x": 462.09772778809963,
                "y": -52.6799937271779
            },
            "width": 163,
            "height": 71,
            "selected": false,
            "positionAbsolute": {
                "x": 462.09772778809963,
                "y": -52.6799937271779
            },
            "dragging": false
        }
    ];
      const edges = [
        {
            "source": "node_xi0vtxb2a",
            "sourceHandle": "source-right",
            "target": "node_zp93fwe75",
            "targetHandle": "target-left",
            "type": "InstanceConstructor_Connector",
            "id": "reactflow__edge-node_xi0vtxb2asource-right-node_zp93fwe75target-left"
        },
        {
            "source": "node_zp93fwe75",
            "sourceHandle": "source-right",
            "target": "node_dcyvktr84",
            "targetHandle": "target-left",
            "type": "Role",
            "id": "reactflow__edge-node_zp93fwe75source-right-node_dcyvktr84target-left"
        },
        {
            "source": "node_dcyvktr84",
            "sourceHandle": "source-topLeft",
            "target": "node_9jasq0ljc",
            "targetHandle": "target-bottom",
            "type": "Role",
            "id": "reactflow__edge-node_dcyvktr84source-topLeft-node_9jasq0ljctarget-bottom"
        },
        {
            "source": "node_dcyvktr84",
            "sourceHandle": "source-bottom",
            "target": "node_65io4oo4z",
            "targetHandle": "target-top",
            "type": "Role",
            "id": "reactflow__edge-node_dcyvktr84source-bottom-node_65io4oo4ztarget-top"
        },
        {
            "source": "node_dcyvktr84",
            "sourceHandle": "source-topRight",
            "target": "node_427vemybj",
            "targetHandle": "target-bottom",
            "type": "Role",
            "id": "reactflow__edge-node_dcyvktr84source-topRight-node_427vemybjtarget-bottom"
        },
        {
            "source": "node_dcyvktr84",
            "sourceHandle": "source-right",
            "target": "node_6d9zv30yp",
            "targetHandle": "target-left",
            "type": "Role",
            "id": "reactflow__edge-node_dcyvktr84source-right-node_6d9zv30yptarget-left"
        }
    ];

      // Call the custom method to add nodes and edges
      win.addNodesAndEdges(nodes, edges);

      // Continue with your test assertions
      cy.wait(1000); // Wait for the state to update

      // Call generateText and check the results
      cy.window().then((win) => {
        if (typeof win.generateText === 'function') {
          win.generateText(); // Call the function
        } else {
          throw new Error("Generate Text function is not available");
        }
      });

      cy.wait(1000); // Adjust time as needed to allow for async operations

      cy.get('.Textbox p').should(($p) => {
        const text = $p.html(); // Get the HTML content
        expect(text).to.contain('TypeConstructor:C5(<br>&nbsp;&nbsp;&nbsp;&nbsp;Property(P22(r1,r2,r3,r4,r5)),<br>&nbsp;&nbsp;&nbsp;&nbsp;r1:ObjectType(Q9960),<br>&nbsp;&nbsp;&nbsp;&nbsp;r2:ObjectType(Q42 ),<br>&nbsp;&nbsp;&nbsp;&nbsp;r3:ObjectType(Q62070381),<br>&nbsp;&nbsp;&nbsp;&nbsp;r4:ObjectType(Q18844224),<br>&nbsp;&nbsp;&nbsp;&nbsp;r5:ObjectType(Q29514218))<br><br>');
      });
    });
  });

  //testing dynamic arguments (for functions)

  it('should add a constructor with one argument and a function, and verify text', () => {
    cy.get('.FlowTest').should('be.visible');

    // Add nodes and edges
    cy.window().then((win) => {
      const nodes = [
        {
            "id": "node_xi0vtxb2a",
            "data": {
                "label": "Type Constructor",
                "inputType": "TypeConstructor",
                "picture": "TypeConstructor",
                "itemLabel": "test",
                "conID": 5,
                "itemID": "",
                "roleID": null
            },
            "type": "TypeConstructor",
            "position": {
                "x": -138.50437519441243,
                "y": 54.79430460017673
            },
            "width": 133,
            "height": 121,
            "selected": false,
            "positionAbsolute": {
                "x": -138.50437519441243,
                "y": 54.79430460017673
            },
            "dragging": false
        },
        {
            "id": "node_zp93fwe75",
            "data": {
                "label": "Object",
                "inputType": "Object",
                "picture": "Object",
                "itemLabel": "Albert Einstein",
                "conID": 5,
                "itemID": "Q9960",
                "roleID": null
            },
            "type": "Object",
            "position": {
                "x": 71.49152008095683,
                "y": 80.9258505249409
            },
            "width": 163,
            "height": 71,
            "selected": false,
            "positionAbsolute": {
                "x": 71.49152008095683,
                "y": 80.9258505249409
            },
            "dragging": false
        },
        {
            "id": "node_gtklsuzkq",
            "data": {
                "label": "One Argument",
                "inputType": "Arguments",
                "picture": "Arguments",
                "itemLabel": "",
                "conID": 5,
                "itemID": "",
                "roleID": null
            },
            "type": "Arguments",
            "position": {
                "x": 284.23874517940163,
                "y": 98.26027032913566
            },
            "width": 133,
            "height": 33,
            "selected": false,
            "positionAbsolute": {
                "x": 284.23874517940163,
                "y": 98.26027032913566
            },
            "dragging": false
        },
        {
            "id": "node_jghq2rj6s",
            "data": {
                "label": "Function",
                "inputType": "Function",
                "picture": "Function",
                "itemLabel": "Age",
                "conID": 5,
                "itemID": "Z12345",
                "roleID": null
            },
            "type": "Function",
            "position": {
                "x": 479.4529060109161,
                "y": 76.02829285584619
            },
            "width": 163,
            "height": 76,
            "selected": true,
            "positionAbsolute": {
                "x": 479.4529060109161,
                "y": 76.02829285584619
            },
            "dragging": false
        }
    ];
      const edges = [
        {
            "source": "node_xi0vtxb2a",
            "sourceHandle": "source-right",
            "target": "node_zp93fwe75",
            "targetHandle": "target-left",
            "type": "InstanceConstructor_Connector",
            "id": "reactflow__edge-node_xi0vtxb2asource-right-node_zp93fwe75target-left"
        },
        {
            "source": "node_zp93fwe75",
            "sourceHandle": "source-right",
            "target": "node_gtklsuzkq",
            "targetHandle": "target-left",
            "type": "Role",
            "id": "reactflow__edge-node_zp93fwe75source-right-node_gtklsuzkqtarget-left"
        },
        {
            "source": "node_gtklsuzkq",
            "sourceHandle": "source-right",
            "target": "node_jghq2rj6s",
            "targetHandle": "target-left",
            "type": "Role",
            "id": "reactflow__edge-node_gtklsuzkqsource-right-node_jghq2rj6starget-left"
        }
    ];

      // Call the custom method to add nodes and edges
      win.addNodesAndEdges(nodes, edges);

      // Continue with your test assertions
      cy.wait(1000); // Wait for the state to update

      // Call generateText and check the results
      cy.window().then((win) => {
        if (typeof win.generateText === 'function') {
          win.generateText(); // Call the function
        } else {
          throw new Error("Generate Text function is not available");
        }
      });

      cy.wait(1000); // Adjust time as needed to allow for async operations

      cy.get('.Textbox p').should(($p) => {
        const text = $p.html(); // Get the HTML content
        expect(text).to.contain('TypeConstructor:C5(<br>&nbsp;&nbsp;&nbsp;&nbsp;Function(Z12345(Q9960)))<br><br>');
      });
    });
  });

  it('should add a constructor with two arguments and a function, and verify text', () => {
    cy.get('.FlowTest').should('be.visible');

    // Add nodes and edges
    cy.window().then((win) => {
      const nodes = [
        {
            "id": "node_xi0vtxb2a",
            "data": {
                "label": "Type Constructor",
                "inputType": "TypeConstructor",
                "picture": "TypeConstructor",
                "itemLabel": "test",
                "conID": 5,
                "itemID": "",
                "roleID": null
            },
            "type": "TypeConstructor",
            "position": {
                "x": -138.50437519441243,
                "y": 54.79430460017673
            },
            "width": 133,
            "height": 121,
            "selected": false,
            "positionAbsolute": {
                "x": -138.50437519441243,
                "y": 54.79430460017673
            },
            "dragging": false
        },
        {
            "id": "node_zp93fwe75",
            "data": {
                "label": "Object",
                "inputType": "Object",
                "picture": "Object",
                "itemLabel": "Albert Einstein",
                "conID": 5,
                "itemID": "Q9960",
                "roleID": null
            },
            "type": "Object",
            "position": {
                "x": 71.49152008095683,
                "y": 80.9258505249409
            },
            "width": 163,
            "height": 71,
            "selected": false,
            "positionAbsolute": {
                "x": 71.49152008095683,
                "y": 80.9258505249409
            },
            "dragging": false
        },
        {
            "id": "node_i5z51opxm",
            "data": {
                "label": "Two Arguments",
                "inputType": "Arguments",
                "picture": "Arguments_2",
                "itemLabel": "",
                "conID": 5,
                "itemID": "",
                "roleID": null
            },
            "type": "Arguments",
            "position": {
                "x": 304.0172401860349,
                "y": 104.12820070976989
            },
            "width": 133,
            "height": 25,
            "selected": false,
            "positionAbsolute": {
                "x": 304.0172401860349,
                "y": 104.12820070976989
            },
            "dragging": false
        },
        {
            "id": "node_qthi1u6yp",
            "data": {
                "label": "Object",
                "inputType": "Object",
                "picture": "Object",
                "itemLabel": "Edith Eger",
                "conID": 5,
                "itemID": "Q62070381",
                "roleID": null
            },
            "type": "Object",
            "position": {
                "x": 273.0659766816389,
                "y": -33.15396394970881
            },
            "width": 163,
            "height": 71,
            "selected": false,
            "positionAbsolute": {
                "x": 273.0659766816389,
                "y": -33.15396394970881
            },
            "dragging": false
        },
        {
            "id": "node_kivxpmyjr",
            "data": {
                "label": "Function",
                "inputType": "Function",
                "picture": "Function",
                "itemLabel": "and",
                "conID": 5,
                "itemID": "Z10174",
                "roleID": null
            },
            "type": "Function",
            "position": {
                "x": 512.2259086456561,
                "y": 81.64340579813927
            },
            "width": 163,
            "height": 76,
            "selected": true,
            "positionAbsolute": {
                "x": 512.2259086456561,
                "y": 81.64340579813927
            },
            "dragging": false
        }
    ];
      const edges = [
        {
            "source": "node_xi0vtxb2a",
            "sourceHandle": "source-right",
            "target": "node_zp93fwe75",
            "targetHandle": "target-left",
            "type": "InstanceConstructor_Connector",
            "id": "reactflow__edge-node_xi0vtxb2asource-right-node_zp93fwe75target-left"
        },
        {
            "source": "node_zp93fwe75",
            "sourceHandle": "source-right",
            "target": "node_i5z51opxm",
            "targetHandle": "target-left",
            "type": "Role",
            "id": "reactflow__edge-node_zp93fwe75source-right-node_i5z51opxmtarget-left"
        },
        {
            "source": "node_i5z51opxm",
            "sourceHandle": "source-top",
            "target": "node_qthi1u6yp",
            "targetHandle": "target-bottom",
            "type": "Role",
            "id": "reactflow__edge-node_i5z51opxmsource-top-node_qthi1u6yptarget-bottom"
        },
        {
            "source": "node_i5z51opxm",
            "sourceHandle": "source-right",
            "target": "node_kivxpmyjr",
            "targetHandle": "target-left",
            "type": "Role",
            "id": "reactflow__edge-node_i5z51opxmsource-right-node_kivxpmyjrtarget-left"
        }
    ];

      // Call the custom method to add nodes and edges
      win.addNodesAndEdges(nodes, edges);

      // Continue with your test assertions
      cy.wait(1000); // Wait for the state to update

      // Call generateText and check the results
      cy.window().then((win) => {
        if (typeof win.generateText === 'function') {
          win.generateText(); // Call the function
        } else {
          throw new Error("Generate Text function is not available");
        }
      });

      cy.wait(1000); // Adjust time as needed to allow for async operations

      cy.get('.Textbox p').should(($p) => {
        const text = $p.html(); // Get the HTML content
        expect(text).to.contain('TypeConstructor:C5(<br>&nbsp;&nbsp;&nbsp;&nbsp;Function(Z10174(Q9960, Q62070381)))<br><br>');
      });
    });
  });

  it('should add a constructor with three arguments and a function, and verify text', () => {
    cy.get('.FlowTest').should('be.visible');

    // Add nodes and edges
    cy.window().then((win) => {
      const nodes = [
        {
            "id": "node_xi0vtxb2a",
            "data": {
                "label": "Type Constructor",
                "inputType": "TypeConstructor",
                "picture": "TypeConstructor",
                "itemLabel": "test",
                "conID": 5,
                "itemID": "",
                "roleID": null
            },
            "type": "TypeConstructor",
            "position": {
                "x": -138.50437519441243,
                "y": 54.79430460017673
            },
            "width": 133,
            "height": 121,
            "selected": false,
            "positionAbsolute": {
                "x": -138.50437519441243,
                "y": 54.79430460017673
            },
            "dragging": false
        },
        {
            "id": "node_zp93fwe75",
            "data": {
                "label": "Object",
                "inputType": "Object",
                "picture": "Object",
                "itemLabel": "Albert Einstein",
                "conID": 5,
                "itemID": "Q9960",
                "roleID": null
            },
            "type": "Object",
            "position": {
                "x": 71.49152008095683,
                "y": 80.9258505249409
            },
            "width": 163,
            "height": 71,
            "selected": false,
            "positionAbsolute": {
                "x": 71.49152008095683,
                "y": 80.9258505249409
            },
            "dragging": false
        },
        {
            "id": "node_qthi1u6yp",
            "data": {
                "label": "Object",
                "inputType": "Object",
                "picture": "Object",
                "itemLabel": "Edith Eger",
                "conID": 5,
                "itemID": "Q62070381",
                "roleID": null
            },
            "type": "Object",
            "position": {
                "x": 273.0659766816389,
                "y": -33.15396394970881
            },
            "width": 163,
            "height": 71,
            "selected": false,
            "positionAbsolute": {
                "x": 273.0659766816389,
                "y": -33.15396394970881
            },
            "dragging": false
        },
        {
            "id": "node_kivxpmyjr",
            "data": {
                "label": "Function",
                "inputType": "Function",
                "picture": "Function",
                "itemLabel": "and",
                "conID": 5,
                "itemID": "Z10174",
                "roleID": null
            },
            "type": "Function",
            "position": {
                "x": 512.2259086456561,
                "y": 81.64340579813927
            },
            "width": 163,
            "height": 76,
            "selected": false,
            "positionAbsolute": {
                "x": 512.2259086456561,
                "y": 81.64340579813927
            },
            "dragging": false
        },
        {
            "id": "node_tslvg2tyi",
            "data": {
                "label": "Three Arguments",
                "inputType": "Arguments",
                "picture": "Arguments_3",
                "itemLabel": "",
                "conID": 5,
                "itemID": "",
                "roleID": null
            },
            "type": "Arguments",
            "position": {
                "x": 314.08990228570207,
                "y": 103.49536704323535
            },
            "width": 133,
            "height": 25,
            "selected": false,
            "positionAbsolute": {
                "x": 314.08990228570207,
                "y": 103.49536704323535
            },
            "dragging": false
        },
        {
            "id": "node_jy3ymoryb",
            "data": {
                "label": "Object",
                "inputType": "Object",
                "picture": "Object",
                "itemLabel": "Douglas Adams",
                "conID": 5,
                "itemID": "Q42 ",
                "roleID": null
            },
            "type": "Object",
            "position": {
                "x": 304.95306324509613,
                "y": 180.72558129230976
            },
            "width": 163,
            "height": 71,
            "selected": false,
            "positionAbsolute": {
                "x": 304.95306324509613,
                "y": 180.72558129230976
            },
            "dragging": false
        }
    ];
      const edges = [
        {
            "source": "node_xi0vtxb2a",
            "sourceHandle": "source-right",
            "target": "node_zp93fwe75",
            "targetHandle": "target-left",
            "type": "InstanceConstructor_Connector",
            "id": "reactflow__edge-node_xi0vtxb2asource-right-node_zp93fwe75target-left"
        },
        {
            "source": "node_zp93fwe75",
            "sourceHandle": "source-right",
            "target": "node_tslvg2tyi",
            "targetHandle": "target-left",
            "type": "Role",
            "id": "reactflow__edge-node_zp93fwe75source-right-node_tslvg2tyitarget-left"
        },
        {
            "source": "node_tslvg2tyi",
            "sourceHandle": "source-top",
            "target": "node_qthi1u6yp",
            "targetHandle": "target-bottom",
            "type": "Role",
            "id": "reactflow__edge-node_tslvg2tyisource-top-node_qthi1u6yptarget-bottom"
        },
        {
            "source": "node_tslvg2tyi",
            "sourceHandle": "source-bottom",
            "target": "node_jy3ymoryb",
            "targetHandle": "target-top",
            "type": "Role",
            "id": "reactflow__edge-node_tslvg2tyisource-bottom-node_jy3ymorybtarget-top"
        },
        {
            "source": "node_tslvg2tyi",
            "sourceHandle": "source-right",
            "target": "node_kivxpmyjr",
            "targetHandle": "target-left",
            "type": "Role",
            "id": "reactflow__edge-node_tslvg2tyisource-right-node_kivxpmyjrtarget-left"
        }
    ];

      // Call the custom method to add nodes and edges
      win.addNodesAndEdges(nodes, edges);

      // Continue with your test assertions
      cy.wait(1000); // Wait for the state to update

      // Call generateText and check the results
      cy.window().then((win) => {
        if (typeof win.generateText === 'function') {
          win.generateText(); // Call the function
        } else {
          throw new Error("Generate Text function is not available");
        }
      });

      cy.wait(1000); // Adjust time as needed to allow for async operations

      cy.get('.Textbox p').should(($p) => {
        const text = $p.html(); // Get the HTML content
        expect(text).to.contain('TypeConstructor:C5(<br>&nbsp;&nbsp;&nbsp;&nbsp;Function(Z10174(Q9960, Q62070381, Q42 )))<br><br>');
      });
    });
  });

  it('should add a constructor with four arguments and a function, and verify text', () => {
    cy.get('.FlowTest').should('be.visible');

    // Add nodes and edges
    cy.window().then((win) => {
      const nodes = [
        {
            "id": "node_xi0vtxb2a",
            "data": {
                "label": "Type Constructor",
                "inputType": "TypeConstructor",
                "picture": "TypeConstructor",
                "itemLabel": "test",
                "conID": 5,
                "itemID": "",
                "roleID": null
            },
            "type": "TypeConstructor",
            "position": {
                "x": -138.50437519441243,
                "y": 54.79430460017673
            },
            "width": 133,
            "height": 121,
            "selected": false,
            "positionAbsolute": {
                "x": -138.50437519441243,
                "y": 54.79430460017673
            },
            "dragging": false
        },
        {
            "id": "node_zp93fwe75",
            "data": {
                "label": "Object",
                "inputType": "Object",
                "picture": "Object",
                "itemLabel": "Albert Einstein",
                "conID": 5,
                "itemID": "Q9960",
                "roleID": null
            },
            "type": "Object",
            "position": {
                "x": 71.49152008095683,
                "y": 80.9258505249409
            },
            "width": 163,
            "height": 71,
            "selected": false,
            "positionAbsolute": {
                "x": 71.49152008095683,
                "y": 80.9258505249409
            },
            "dragging": false
        },
        {
            "id": "node_qthi1u6yp",
            "data": {
                "label": "Object",
                "inputType": "Object",
                "picture": "Object",
                "itemLabel": "Edith Eger",
                "conID": 5,
                "itemID": "Q62070381",
                "roleID": null
            },
            "type": "Object",
            "position": {
                "x": 199.06597668163892,
                "y": -39.15396394970881
            },
            "width": 163,
            "height": 71,
            "selected": false,
            "positionAbsolute": {
                "x": 199.06597668163892,
                "y": -39.15396394970881
            },
            "dragging": false
        },
        {
            "id": "node_kivxpmyjr",
            "data": {
                "label": "Function",
                "inputType": "Function",
                "picture": "Function",
                "itemLabel": "and",
                "conID": 5,
                "itemID": "Z10174",
                "roleID": null
            },
            "type": "Function",
            "position": {
                "x": 512.2259086456561,
                "y": 81.64340579813927
            },
            "width": 163,
            "height": 76,
            "selected": false,
            "positionAbsolute": {
                "x": 512.2259086456561,
                "y": 81.64340579813927
            },
            "dragging": false
        },
        {
            "id": "node_jy3ymoryb",
            "data": {
                "label": "Object",
                "inputType": "Object",
                "picture": "Object",
                "itemLabel": "Douglas Adams",
                "conID": 5,
                "itemID": "Q42 ",
                "roleID": null
            },
            "type": "Object",
            "position": {
                "x": 304.95306324509613,
                "y": 180.72558129230976
            },
            "width": 163,
            "height": 71,
            "selected": false,
            "positionAbsolute": {
                "x": 304.95306324509613,
                "y": 180.72558129230976
            },
            "dragging": false
        },
        {
            "id": "node_lphychz3m",
            "data": {
                "label": "Four Arguments",
                "inputType": "Arguments",
                "picture": "Arguments_4",
                "itemLabel": "",
                "conID": 5,
                "itemID": "",
                "roleID": null
            },
            "type": "Arguments",
            "position": {
                "x": 296.4423963186002,
                "y": 106.12207596488618
            },
            "width": 173,
            "height": 23,
            "selected": false,
            "positionAbsolute": {
                "x": 296.4423963186002,
                "y": 106.12207596488618
            },
            "dragging": false
        },
        {
            "id": "node_scdswaboq",
            "data": {
                "label": "Object",
                "inputType": "Object",
                "picture": "Object",
                "itemLabel": "parent",
                "conID": 5,
                "itemID": "Q7566",
                "roleID": null
            },
            "type": "Object",
            "position": {
                "x": 393.6758988496057,
                "y": -43.221796583696346
            },
            "width": 163,
            "height": 71,
            "selected": true,
            "positionAbsolute": {
                "x": 393.6758988496057,
                "y": -43.221796583696346
            },
            "dragging": false
        }
    ];
      const edges = [
        {
            "source": "node_xi0vtxb2a",
            "sourceHandle": "source-right",
            "target": "node_zp93fwe75",
            "targetHandle": "target-left",
            "type": "InstanceConstructor_Connector",
            "id": "reactflow__edge-node_xi0vtxb2asource-right-node_zp93fwe75target-left"
        },
        {
            "source": "node_zp93fwe75",
            "sourceHandle": "source-right",
            "target": "node_lphychz3m",
            "targetHandle": "target-left",
            "type": "Role",
            "id": "reactflow__edge-node_zp93fwe75source-right-node_lphychz3mtarget-left"
        },
        {
            "source": "node_lphychz3m",
            "sourceHandle": "source-top",
            "target": "node_qthi1u6yp",
            "targetHandle": "target-bottom",
            "type": "Role",
            "id": "reactflow__edge-node_lphychz3msource-top-node_qthi1u6yptarget-bottom"
        },
        {
            "source": "node_lphychz3m",
            "sourceHandle": "source-bottom",
            "target": "node_jy3ymoryb",
            "targetHandle": "target-top",
            "type": "Role",
            "id": "reactflow__edge-node_lphychz3msource-bottom-node_jy3ymorybtarget-top"
        },
        {
            "source": "node_lphychz3m",
            "sourceHandle": "source-top2",
            "target": "node_scdswaboq",
            "targetHandle": "target-bottom",
            "type": "Role",
            "id": "reactflow__edge-node_lphychz3msource-top2-node_scdswaboqtarget-bottom"
        },
        {
            "source": "node_lphychz3m",
            "sourceHandle": "source-right",
            "target": "node_kivxpmyjr",
            "targetHandle": "target-left",
            "type": "Role",
            "id": "reactflow__edge-node_lphychz3msource-right-node_kivxpmyjrtarget-left"
        }
    ];

      // Call the custom method to add nodes and edges
      win.addNodesAndEdges(nodes, edges);

      // Continue with your test assertions
      cy.wait(1000); // Wait for the state to update

      // Call generateText and check the results
      cy.window().then((win) => {
        if (typeof win.generateText === 'function') {
          win.generateText(); // Call the function
        } else {
          throw new Error("Generate Text function is not available");
        }
      });

      cy.wait(1000); // Adjust time as needed to allow for async operations

      cy.get('.Textbox p').should(($p) => {
        const text = $p.html(); // Get the HTML content
        expect(text).to.contain('TypeConstructor:C5(<br>&nbsp;&nbsp;&nbsp;&nbsp;Function(Z10174(Q9960, Q62070381, Q42 , Q7566)))<br><br>');
      });
    });
  });

  //test more complex constructor examples (from technical report)

  it('should add the Edith Eger example constructor, and verify text', () => {
    cy.get('.FlowTest').should('be.visible');

    // Add nodes and edges
    cy.window().then((win) => {
      const nodes = [
        {
            "id": "node_sglfc7k6h",
            "data": {
                "conID": 1,
                "label": "Type Constructor",
                "itemID": "",
                "roleID": null,
                "picture": "TypeConstructor",
                "inputType": "TypeConstructor",
                "itemLabel": "Offspring"
            },
            "type": "TypeConstructor",
            "width": 133,
            "height": 121,
            "position": {
                "x": 14.627359607343472,
                "y": 264.4494738193365
            },
            "positionAbsolute": {
                "x": 14.627359607343472,
                "y": 264.4494738193365
            }
        },
        {
            "id": "node_hvj1kng0n",
            "data": {
                "conID": 1,
                "label": "Object",
                "itemID": "Q7566",
                "roleID": null,
                "picture": "Object",
                "inputType": "Object",
                "itemLabel": "parent"
            },
            "type": "Object",
            "width": 163,
            "height": 71,
            "dragging": false,
            "position": {
                "x": 226.5595219629974,
                "y": 290.3236464077195
            },
            "selected": false,
            "positionAbsolute": {
                "x": 226.5595219629974,
                "y": 290.3236464077195
            }
        },
        {
            "id": "node_12xzrhksi",
            "data": {
                "conID": 1,
                "label": "Two Roles",
                "itemID": "P40",
                "roleID": 2,
                "picture": "Property",
                "inputType": "Property",
                "itemLabel": "child"
            },
            "type": "Property",
            "width": 133,
            "height": 48,
            "dragging": false,
            "position": {
                "x": 449.12837705221017,
                "y": 302.05787932324336
            },
            "selected": false,
            "positionAbsolute": {
                "x": 449.12837705221017,
                "y": 302.05787932324336
            }
        },
        {
            "id": "node_lznj20swj",
            "data": {
                "conID": 1,
                "label": "Object",
                "itemID": "Q29514218",
                "roleID": null,
                "picture": "Object",
                "inputType": "Object",
                "itemLabel": "child"
            },
            "type": "Object",
            "width": 163,
            "height": 71,
            "dragging": false,
            "position": {
                "x": 652.2872017519342,
                "y": 290.954643533905
            },
            "selected": false,
            "positionAbsolute": {
                "x": 652.2872017519342,
                "y": 290.954643533905
            }
        },
        {
            "id": "node_2vxuy8acx",
            "data": {
                "conID": 2,
                "label": "Instance Constructor",
                "itemID": "",
                "roleID": null,
                "picture": "InstanceConstructor",
                "inputType": "InstanceConstructor",
                "itemLabel": "EEger"
            },
            "type": "InstanceConstructor",
            "width": 108,
            "height": 98,
            "dragging": false,
            "position": {
                "x": 27.055126105953832,
                "y": 454.82161122553873
            },
            "selected": false,
            "positionAbsolute": {
                "x": 27.055126105953832,
                "y": 454.82161122553873
            }
        },
        {
            "id": "node_26gwvl9ag",
            "data": {
                "conID": 2,
                "label": "Object",
                "itemID": "Q7566",
                "roleID": null,
                "picture": "Object",
                "inputType": "Object",
                "itemLabel": "parent"
            },
            "type": "Object",
            "width": 163,
            "height": 71,
            "dragging": false,
            "position": {
                "x": 232.8227606139418,
                "y": 469.2758854896731
            },
            "selected": false,
            "positionAbsolute": {
                "x": 232.8227606139418,
                "y": 469.2758854896731
            }
        },
        {
            "id": "node_5rf8fkr0i",
            "data": {
                "conID": 2,
                "label": "Two Roles",
                "itemID": "P40",
                "roleID": 4,
                "picture": "Property",
                "inputType": "Property",
                "itemLabel": "child"
            },
            "type": "Property",
            "width": 133,
            "height": 48,
            "dragging": false,
            "position": {
                "x": 454.750505776569,
                "y": 478.0843329023776
            },
            "selected": false,
            "positionAbsolute": {
                "x": 454.750505776569,
                "y": 478.0843329023776
            }
        },
        {
            "id": "node_bhwrwtirn",
            "data": {
                "conID": 2,
                "label": "Object",
                "itemID": "Q29514218",
                "roleID": null,
                "picture": "Object",
                "inputType": "Object",
                "itemLabel": "child"
            },
            "type": "Object",
            "width": 163,
            "height": 71,
            "dragging": false,
            "position": {
                "x": 653.8590849700131,
                "y": 463.02555366414265
            },
            "selected": false,
            "positionAbsolute": {
                "x": 653.8590849700131,
                "y": 463.02555366414265
            }
        },
        {
            "id": "node_57gruzzkx",
            "data": {
                "conID": 3,
                "label": "Type Constructor",
                "itemID": "",
                "roleID": null,
                "picture": "TypeConstructor",
                "inputType": "TypeConstructor",
                "itemLabel": "Age"
            },
            "type": "TypeConstructor",
            "width": 133,
            "height": 121,
            "dragging": false,
            "position": {
                "x": -180.4192166592365,
                "y": 588.5968145117462
            },
            "selected": false,
            "positionAbsolute": {
                "x": -180.4192166592365,
                "y": 588.5968145117462
            }
        },
        {
            "id": "node_evw2a9p20",
            "data": {
                "conID": 3,
                "label": "Object",
                "itemID": "Q7566",
                "roleID": null,
                "picture": "Object",
                "inputType": "Object",
                "itemLabel": "parent"
            },
            "type": "Object",
            "width": 163,
            "height": 71,
            "dragging": false,
            "position": {
                "x": 38.08699930529269,
                "y": 611.8232457732927
            },
            "selected": false,
            "positionAbsolute": {
                "x": 38.08699930529269,
                "y": 611.8232457732927
            }
        },
        {
            "id": "node_ovk4c2qq9",
            "data": {
                "conID": 3,
                "label": "Two Roles",
                "itemID": "P40",
                "roleID": 6,
                "picture": "Property",
                "inputType": "Property",
                "itemLabel": "child"
            },
            "type": "Property",
            "width": 133,
            "height": 48,
            "dragging": false,
            "position": {
                "x": 307.11441599639943,
                "y": 621.7662341110404
            },
            "selected": false,
            "positionAbsolute": {
                "x": 307.11441599639943,
                "y": 621.7662341110404
            }
        },
        {
            "id": "node_ozcxhniqw",
            "data": {
                "conID": 3,
                "label": "Object",
                "itemID": "Q29514218",
                "roleID": null,
                "picture": "Object",
                "inputType": "Object",
                "itemLabel": "child"
            },
            "type": "Object",
            "width": 163,
            "height": 71,
            "dragging": false,
            "position": {
                "x": 504.7946675677893,
                "y": 611.4664799010484
            },
            "selected": false,
            "positionAbsolute": {
                "x": 504.7946675677893,
                "y": 611.4664799010484
            }
        },
        {
            "id": "node_szkzxs2o5",
            "data": {
                "conID": 3,
                "label": "One Argument",
                "itemID": "",
                "roleID": null,
                "picture": "Arguments",
                "inputType": "Arguments",
                "itemLabel": ""
            },
            "type": "Arguments",
            "width": 133,
            "height": 33,
            "dragging": false,
            "position": {
                "x": 721.0324481326288,
                "y": 631.4348122399127
            },
            "selected": false,
            "positionAbsolute": {
                "x": 721.0324481326288,
                "y": 631.4348122399127
            }
        },
        {
            "id": "node_35tfsfxdh",
            "data": {
                "conID": 3,
                "label": "Function",
                "itemID": "Z12345",
                "roleID": null,
                "picture": "Function",
                "inputType": "Function",
                "itemLabel": "Age"
            },
            "type": "Function",
            "width": 163,
            "height": 76,
            "dragging": false,
            "position": {
                "x": 898.1719092595877,
                "y": 610.0450540906606
            },
            "selected": false,
            "positionAbsolute": {
                "x": 898.1719092595877,
                "y": 610.0450540906606
            }
        },
        {
            "id": "node_96cezid99",
            "data": {
                "conID": 2,
                "label": "Value Constraint",
                "itemID": "Q62070381",
                "picture": "ValueConstraint",
                "inputType": "ValueConstraint",
                "itemLabel": "Edith Eger"
            },
            "type": "ValueConstraint",
            "width": 96,
            "height": 41,
            "dragging": false,
            "position": {
                "x": 685.440108687228,
                "y": 570.3267227399999
            },
            "selected": false,
            "positionAbsolute": {
                "x": 685.440108687228,
                "y": 570.3267227399999
            }
        }
    ];
      const edges = [
        {
            "id": "reactflow__edge-node_sglfc7k6hsource-right-node_hvj1kng0ntarget-left",
            "type": "InstanceConstructor_Connector",
            "source": "node_sglfc7k6h",
            "target": "node_hvj1kng0n",
            "sourceHandle": "source-right",
            "targetHandle": "target-left"
        },
        {
            "id": "reactflow__edge-node_hvj1kng0nsource-right-node_12xzrhksitarget-left",
            "type": "Role",
            "source": "node_hvj1kng0n",
            "target": "node_12xzrhksi",
            "sourceHandle": "source-right",
            "targetHandle": "target-left"
        },
        {
            "id": "reactflow__edge-node_12xzrhksisource-right-node_lznj20swjtarget-left",
            "type": "Role",
            "source": "node_12xzrhksi",
            "target": "node_lznj20swj",
            "sourceHandle": "source-right",
            "targetHandle": "target-left"
        },
        {
            "id": "reactflow__edge-node_2vxuy8acxsource-top-node_sglfc7k6htarget-bottom",
            "type": "Instance",
            "source": "node_2vxuy8acx",
            "target": "node_sglfc7k6h",
            "sourceHandle": "source-top",
            "targetHandle": "target-bottom"
        },
        {
            "id": "reactflow__edge-node_2vxuy8acxsource-right-node_26gwvl9agtarget-left",
            "type": "InstanceConstructor_Connector",
            "source": "node_2vxuy8acx",
            "target": "node_26gwvl9ag",
            "sourceHandle": "source-right",
            "targetHandle": "target-left"
        },
        {
            "id": "reactflow__edge-node_26gwvl9agsource-right-node_5rf8fkr0itarget-left",
            "type": "Role",
            "source": "node_26gwvl9ag",
            "target": "node_5rf8fkr0i",
            "sourceHandle": "source-right",
            "targetHandle": "target-left"
        },
        {
            "id": "reactflow__edge-node_5rf8fkr0isource-right-node_bhwrwtirntarget-left",
            "type": "Role",
            "source": "node_5rf8fkr0i",
            "target": "node_bhwrwtirn",
            "sourceHandle": "source-right",
            "targetHandle": "target-left"
        },
        {
            "id": "reactflow__edge-node_57gruzzkxsource-top-node_sglfc7k6htarget-left",
            "type": "Sub-constructor",
            "source": "node_57gruzzkx",
            "target": "node_sglfc7k6h",
            "sourceHandle": "source-top",
            "targetHandle": "target-left"
        },
        {
            "id": "reactflow__edge-node_57gruzzkxsource-right-node_evw2a9p20target-left",
            "type": "InstanceConstructor_Connector",
            "source": "node_57gruzzkx",
            "target": "node_evw2a9p20",
            "sourceHandle": "source-right",
            "targetHandle": "target-left"
        },
        {
            "id": "reactflow__edge-node_evw2a9p20source-right-node_ovk4c2qq9target-left",
            "type": "Role",
            "source": "node_evw2a9p20",
            "target": "node_ovk4c2qq9",
            "sourceHandle": "source-right",
            "targetHandle": "target-left"
        },
        {
            "id": "reactflow__edge-node_ovk4c2qq9source-right-node_ozcxhniqwtarget-left",
            "type": "Role",
            "source": "node_ovk4c2qq9",
            "target": "node_ozcxhniqw",
            "sourceHandle": "source-right",
            "targetHandle": "target-left"
        },
        {
            "id": "reactflow__edge-node_ozcxhniqwsource-right-node_szkzxs2o5target-left",
            "type": "Role",
            "source": "node_ozcxhniqw",
            "target": "node_szkzxs2o5",
            "sourceHandle": "source-right",
            "targetHandle": "target-left"
        },
        {
            "id": "reactflow__edge-node_szkzxs2o5source-right-node_35tfsfxdhtarget-left",
            "type": "Role",
            "source": "node_szkzxs2o5",
            "target": "node_35tfsfxdh",
            "sourceHandle": "source-right",
            "targetHandle": "target-left"
        },
        {
            "id": "reactflow__edge-node_96cezid99IN-top-node_bhwrwtirntarget-bottom",
            "type": "Instance",
            "source": "node_96cezid99",
            "target": "node_bhwrwtirn",
            "sourceHandle": "IN-top",
            "targetHandle": "target-bottom"
        }
    ];

      // Call the custom method to add nodes and edges
      win.addNodesAndEdges(nodes, edges);

      // Continue with your test assertions
      cy.wait(1000); // Wait for the state to update

      // Call generateText and check the results
      cy.window().then((win) => {
        if (typeof win.generateText === 'function') {
          win.generateText(); // Call the function
        } else {
          throw new Error("Generate Text function is not available");
        }
      });

      cy.wait(1000); // Adjust time as needed to allow for async operations

      cy.get('.Textbox p').should(($p) => {
        const text = $p.html(); // Get the HTML content
        expect(text).to.contain('TypeConstructor:C1(<br>&nbsp;&nbsp;&nbsp;&nbsp;Property(P40(r1,r2)),<br>&nbsp;&nbsp;&nbsp;&nbsp;r1:ObjectType(Q7566),<br>&nbsp;&nbsp;&nbsp;&nbsp;r2:ObjectType(Q29514218))<br><br>InstanceOf(C2, C1)<br><br>InstanceConstructor:C2(<br>&nbsp;&nbsp;&nbsp;&nbsp;Property(P40(r1,r2)),<br>&nbsp;&nbsp;&nbsp;&nbsp;r1:ObjectType(Q7566),<br>&nbsp;&nbsp;&nbsp;&nbsp;r2:ObjectType(Q29514218),<br>&nbsp;&nbsp;&nbsp;&nbsp;ObjectType(Q29514218)={Q62070381})<br><br>SubConstructorOf(C3, C1)<br><br>TypeConstructor:C3(<br>&nbsp;&nbsp;&nbsp;&nbsp;Property(P40(r1,r2)),<br>&nbsp;&nbsp;&nbsp;&nbsp;r1:ObjectType(Q7566),<br>&nbsp;&nbsp;&nbsp;&nbsp;r2:ObjectType(Q29514218),<br>&nbsp;&nbsp;&nbsp;&nbsp;Function(Z12345(Q29514218)))<br><br>');
      });
    });
  });

  it('should add the San Fransisco example constructor, and verify text', () => {
    cy.get('.FlowTest').should('be.visible');

    // Add nodes and edges
    cy.window().then((win) => {
      const nodes = [
        {
            "id": "node_82l420wir",
            "data": {
                "conID": 4,
                "label": "Instance Constructor",
                "itemID": "",
                "roleID": null,
                "picture": "InstanceConstructor",
                "inputType": "InstanceConstructor",
                "itemLabel": "SF ranking"
            },
            "type": "InstanceConstructor",
            "width": 108,
            "height": 98,
            "position": {
                "x": 46.20456133027344,
                "y": 119.54693856340941
            },
            "positionAbsolute": {
                "x": 46.20456133027344,
                "y": 19.546938563409412
            }
        },
        {
            "id": "node_qiu457bbp",
            "data": {
                "conID": 4,
                "label": "Object",
                "itemID": "Q515",
                "roleID": null,
                "picture": "Object",
                "inputType": "Object",
                "itemLabel": "city"
            },
            "type": "Object",
            "width": 163,
            "height": 71,
            "dragging": false,
            "position": {
                "x": 213.40613677871465,
                "y": 132.52601298298077
            },
            "selected": false,
            "positionAbsolute": {
                "x": 213.40613677871465,
                "y": 32.526012982980774
            }
        },
        {
            "id": "node_sn8x9z42n",
            "data": {
                "conID": 4,
                "label": "Object",
                "itemID": "Q107390",
                "roleID": null,
                "picture": "Object",
                "inputType": "Object",
                "itemLabel": "state"
            },
            "type": "Object",
            "width": 163,
            "height": 71,
            "dragging": false,
            "position": {
                "x": 667.8303428064821,
                "y": 135.41307588068793
            },
            "selected": false,
            "positionAbsolute": {
                "x": 667.8303428064821,
                "y": 35.41307588068793
            }
        },
        {
            "id": "node_7urk91dr4",
            "data": {
                "conID": 4,
                "label": "Two Roles",
                "itemID": "P361",
                "roleID": 2,
                "picture": "Property",
                "inputType": "Property",
                "itemLabel": "part of"
            },
            "type": "Property",
            "width": 133,
            "height": 48,
            "dragging": false,
            "position": {
                "x": 462.8645615731335,
                "y": 145.3232708067854
            },
            "selected": false,
            "positionAbsolute": {
                "x": 462.8645615731335,
                "y": 45.32327080678539
            }
        },
        {
            "id": "node_tb92ja9cf",
            "data": {
                "conID": 4,
                "label": "Value Constraint",
                "itemID": "Q62",
                "picture": "ValueConstraint",
                "inputType": "ValueConstraint",
                "itemLabel": "San Fransisco"
            },
            "type": "ValueConstraint",
            "width": 43,
            "height": 41,
            "dragging": false,
            "position": {
                "x": 275.4979448892765,
                "y": 259.8256094726553
            },
            "selected": false,
            "positionAbsolute": {
                "x": 275.4979448892765,
                "y": 159.82560947265526
            }
        },
        {
            "id": "node_vmjp045c0",
            "data": {
                "conID": 4,
                "label": "Three Arguments",
                "itemID": "",
                "roleID": null,
                "picture": "Arguments_3",
                "inputType": "Arguments",
                "itemLabel": ""
            },
            "type": "Arguments",
            "width": 133,
            "height": 25,
            "dragging": false,
            "position": {
                "x": 496.0095310658051,
                "y": 256.18165894495814
            },
            "selected": false,
            "positionAbsolute": {
                "x": 496.0095310658051,
                "y": 156.18165894495817
            }
        },
        {
            "id": "node_p8k1t5sc6",
            "data": {
                "conID": 4,
                "label": "Object",
                "itemID": "Q1613416",
                "roleID": null,
                "picture": "Object",
                "inputType": "Object",
                "itemLabel": "population"
            },
            "type": "Object",
            "width": 163,
            "height": 71,
            "dragging": false,
            "position": {
                "x": 493.51685383283115,
                "y": 326.93690356645965
            },
            "selected": false,
            "positionAbsolute": {
                "x": 493.51685383283115,
                "y": 226.93690356645965
            }
        },
        {
            "id": "node_2pw33yz2a",
            "data": {
                "conID": 4,
                "label": "Function",
                "itemID": "Z6789",
                "roleID": null,
                "picture": "Function",
                "inputType": "Function",
                "itemLabel": "Rank"
            },
            "type": "Function",
            "width": 163,
            "height": 76,
            "dragging": false,
            "position": {
                "x": 685.0874840083362,
                "y": 254.23934128465154
            },
            "selected": false,
            "positionAbsolute": {
                "x": 685.0874840083362,
                "y": 154.23934128465154
            }
        },
        {
            "id": "node_6bicai7gu",
            "data": {
                "conID": 4,
                "label": "Value Constraint",
                "itemID": "<=4",
                "picture": "ValueConstraint",
                "inputType": "ValueConstraint",
                "itemLabel": null
            },
            "type": "ValueConstraint",
            "width": 40,
            "height": 41,
            "dragging": false,
            "position": {
                "x": 746.3167120515812,
                "y": 373.43352793934343
            },
            "selected": true,
            "positionAbsolute": {
                "x": 746.3167120515812,
                "y": 273.43352793934343
            }
        }
    ];
      const edges = [
        {
            "id": "reactflow__edge-node_82l420wirsource-right-node_qiu457bbptarget-left",
            "type": "InstanceConstructor_Connector",
            "source": "node_82l420wir",
            "target": "node_qiu457bbp",
            "sourceHandle": "source-right",
            "targetHandle": "target-left"
        },
        {
            "id": "reactflow__edge-node_qiu457bbpsource-right-node_7urk91dr4target-left",
            "type": "Role",
            "source": "node_qiu457bbp",
            "target": "node_7urk91dr4",
            "sourceHandle": "source-right",
            "targetHandle": "target-left"
        },
        {
            "id": "reactflow__edge-node_7urk91dr4source-right-node_sn8x9z42ntarget-left",
            "type": "Role",
            "source": "node_7urk91dr4",
            "target": "node_sn8x9z42n",
            "sourceHandle": "source-right",
            "targetHandle": "target-left"
        },
        {
            "id": "reactflow__edge-node_tb92ja9cfIN-top-node_qiu457bbptarget-bottom",
            "type": "Instance",
            "source": "node_tb92ja9cf",
            "target": "node_qiu457bbp",
            "sourceHandle": "IN-top",
            "targetHandle": "target-bottom"
        },
        {
            "id": "reactflow__edge-node_qiu457bbpsource-right-node_vmjp045c0target-left",
            "type": "Role",
            "source": "node_qiu457bbp",
            "target": "node_vmjp045c0",
            "sourceHandle": "source-right",
            "targetHandle": "target-left"
        },
        {
            "id": "reactflow__edge-node_vmjp045c0source-top-node_sn8x9z42ntarget-bottom",
            "type": "Role",
            "source": "node_vmjp045c0",
            "target": "node_sn8x9z42n",
            "sourceHandle": "source-top",
            "targetHandle": "target-bottom"
        },
        {
            "id": "reactflow__edge-node_vmjp045c0source-bottom-node_p8k1t5sc6target-top",
            "type": "Role",
            "source": "node_vmjp045c0",
            "target": "node_p8k1t5sc6",
            "sourceHandle": "source-bottom",
            "targetHandle": "target-top"
        },
        {
            "id": "reactflow__edge-node_vmjp045c0source-right-node_2pw33yz2atarget-left",
            "type": "Role",
            "source": "node_vmjp045c0",
            "target": "node_2pw33yz2a",
            "sourceHandle": "source-right",
            "targetHandle": "target-left"
        },
        {
            "id": "reactflow__edge-node_6bicai7guIN-top-node_2pw33yz2atarget-bottom",
            "type": "ValueConstraint",
            "source": "node_6bicai7gu",
            "target": "node_2pw33yz2a",
            "sourceHandle": "IN-top",
            "targetHandle": "target-bottom"
        }
    ];

      // Call the custom method to add nodes and edges
      win.addNodesAndEdges(nodes, edges);

      // Continue with your test assertions
      cy.wait(1000); // Wait for the state to update

      // Call generateText and check the results
      cy.window().then((win) => {
        if (typeof win.generateText === 'function') {
          win.generateText(); // Call the function
        } else {
          throw new Error("Generate Text function is not available");
        }
      });

      cy.wait(1000); // Adjust time as needed to allow for async operations

      cy.get('.Textbox p').should(($p) => {
        const text = $p.html(); // Get the HTML content
        expect(text).to.contain(`InstanceConstructor:C4(<br>&nbsp;&nbsp;&nbsp;&nbsp;Property(P361(r1,r2)),<br>&nbsp;&nbsp;&nbsp;&nbsp;r1:ObjectType(Q515),<br>&nbsp;&nbsp;&nbsp;&nbsp;r2:ObjectType(Q107390),<br>&nbsp;&nbsp;&nbsp;&nbsp;Function(Z6789(Q515, Q1613416, Q107390)),<br>&nbsp;&nbsp;&nbsp;&nbsp;Function(Z6789)={&lt;=4},<br>&nbsp;&nbsp;&nbsp;&nbsp;ObjectType(Q515)={Q62})<br><br>`);
      });
    });
  });

  it('should add the Capybara example constructor, and verify text', () => {
    cy.get('.FlowTest').should('be.visible');

    // Add nodes and edges
    cy.window().then((win) => {
      const nodes = [
        {
            "id": "node_vitlpj2vv",
            "data": {
                "conID": 7,
                "label": "Type Constructor",
                "itemID": "",
                "roleID": null,
                "picture": "TypeConstructor",
                "inputType": "TypeConstructor",
                "itemLabel": "test"
            },
            "type": "TypeConstructor",
            "width": 133,
            "height": 121,
            "dragging": false,
            "position": {
                "x": 90.65952047922542,
                "y": 158.31539590404168
            },
            "selected": false,
            "positionAbsolute": {
                "x": 90.65952047922542,
                "y": 58.31539590404168
            }
        },
        {
            "id": "node_4fxbcsf4n",
            "data": {
                "conID": 7,
                "label": "Object",
                "itemID": "Q131538",
                "roleID": null,
                "picture": "Object",
                "inputType": "Object",
                "itemLabel": "Capybara"
            },
            "type": "Object",
            "width": 163,
            "height": 71,
            "dragging": false,
            "position": {
                "x": 301.4734289326083,
                "y": 183.82555082260035
            },
            "selected": false,
            "positionAbsolute": {
                "x": 301.4734289326083,
                "y": 83.82555082260035
            }
        },
        {
            "id": "node_tsvepayz6",
            "data": {
                "conID": 7,
                "label": "Two Roles",
                "itemID": "P183",
                "roleID": 2,
                "picture": "Property",
                "inputType": "Property",
                "itemLabel": "endemic to"
            },
            "type": "Property",
            "width": 133,
            "height": 48,
            "dragging": false,
            "position": {
                "x": 546.3020226314542,
                "y": 47.20153388784436
            },
            "selected": false,
            "positionAbsolute": {
                "x": 546.3020226314542,
                "y": -52.79846611215564
            }
        },
        {
            "id": "node_s68g5o76y",
            "data": {
                "conID": 7,
                "label": "Object",
                "itemID": "Q82794",
                "roleID": null,
                "picture": "Object",
                "inputType": "Object",
                "itemLabel": "region"
            },
            "type": "Object",
            "width": 163,
            "height": 71,
            "dragging": false,
            "position": {
                "x": 722.1587641302565,
                "y": 175.3886173979354
            },
            "selected": false,
            "positionAbsolute": {
                "x": 722.1587641302565,
                "y": 75.3886173979354
            }
        },
        {
            "id": "node_tsotzqkue",
            "data": {
                "conID": 7,
                "label": "Two Roles",
                "itemID": "P9714",
                "roleID": 4,
                "picture": "Property",
                "inputType": "Property",
                "itemLabel": "taxon range"
            },
            "type": "Property",
            "width": 133,
            "height": 48,
            "dragging": false,
            "position": {
                "x": 551.3307845544091,
                "y": 311.09867648719876
            },
            "selected": false,
            "positionAbsolute": {
                "x": 551.3307845544091,
                "y": 211.09867648719873
            }
        },
        {
            "id": "node_6uq0ln7z8",
            "data": {
                "conID": 7,
                "label": "Role Name",
                "itemID": "Q22947",
                "picture": "Role_name",
                "inputType": "Role_name",
                "itemLabel": "inhabitant"
            },
            "type": "Role_name",
            "width": 159,
            "height": 41,
            "dragging": false,
            "position": {
                "x": 369.8455872531938,
                "y": 26.986287427108294
            },
            "selected": false,
            "positionAbsolute": {
                "x": 369.8455872531938,
                "y": 26.986287427108294
            }
        },
        {
            "id": "node_01wp5lk0q",
            "data": {
                "conID": 7,
                "label": "Role Name",
                "itemID": "Q17334923",
                "picture": "Role_name",
                "inputType": "Role_name",
                "itemLabel": "location"
            },
            "type": "Role_name",
            "width": 171,
            "height": 41,
            "dragging": false,
            "position": {
                "x": 695.5075824315428,
                "y": 32.99999243988461
            },
            "selected": false,
            "positionAbsolute": {
                "x": 695.5075824315428,
                "y": 32.99999243988461
            }
        },
        {
            "id": "node_bzo69au9k",
            "data": {
                "conID": 7,
                "label": "Join",
                "itemID": "",
                "roleID": null,
                "picture": "Join",
                "inputType": "Join",
                "itemLabel": ""
            },
            "type": "Join",
            "width": 80,
            "height": 77,
            "dragging": false,
            "position": {
                "x": 564.2195751165118,
                "y": 159.82237137577619
            },
            "selected": false,
            "positionAbsolute": {
                "x": 564.2195751165118,
                "y": 59.822371375776186
            }
        }
    ];
      const edges = [
        {
            "id": "reactflow__edge-node_vitlpj2vvsource-right-node_4fxbcsf4ntarget-left",
            "type": "InstanceConstructor_Connector",
            "source": "node_vitlpj2vv",
            "target": "node_4fxbcsf4n",
            "sourceHandle": "source-right",
            "targetHandle": "target-left"
        },
        {
            "id": "reactflow__edge-node_4fxbcsf4nsource-right-node_tsvepayz6target-left",
            "type": "IsMandatory",
            "source": "node_4fxbcsf4n",
            "target": "node_tsvepayz6",
            "sourceHandle": "source-right",
            "targetHandle": "target-left"
        },
        {
            "id": "reactflow__edge-node_tsvepayz6source-right-node_s68g5o76ytarget-left",
            "type": "Role",
            "source": "node_tsvepayz6",
            "target": "node_s68g5o76y",
            "sourceHandle": "source-right",
            "targetHandle": "target-left"
        },
        {
            "id": "reactflow__edge-node_4fxbcsf4nsource-right-node_tsotzqkuetarget-left",
            "type": "IsMandatory",
            "source": "node_4fxbcsf4n",
            "target": "node_tsotzqkue",
            "sourceHandle": "source-right",
            "targetHandle": "target-left"
        },
        {
            "id": "reactflow__edge-node_tsotzqkuesource-right-node_s68g5o76ytarget-left",
            "type": "Role",
            "source": "node_tsotzqkue",
            "target": "node_s68g5o76y",
            "sourceHandle": "source-right",
            "targetHandle": "target-left"
        },
        {
            "id": "reactflow__edge-node_9uo5ouhlzIN-top-node_tsvepayz6target-left",
            "type": "Role_name",
            "source": "node_9uo5ouhlz",
            "target": "node_tsvepayz6",
            "sourceHandle": "IN-top",
            "targetHandle": "target-left"
        },
        {
            "id": "reactflow__edge-node_6uq0ln7z8IN-top-node_tsvepayz6target-left",
            "type": "Role_name",
            "source": "node_6uq0ln7z8",
            "target": "node_tsvepayz6",
            "sourceHandle": "IN-top",
            "targetHandle": "target-left"
        },
        {
            "id": "reactflow__edge-node_tsvepayz6source-right-node_01wp5lk0qIN-bottom",
            "type": "Role_name",
            "source": "node_tsvepayz6",
            "target": "node_01wp5lk0q",
            "sourceHandle": "source-right",
            "targetHandle": "IN-bottom"
        },
        {
            "id": "reactflow__edge-node_bzo69au9ksource-top-node_tsvepayz6target-bottom",
            "type": "Join",
            "source": "node_bzo69au9k",
            "target": "node_tsvepayz6",
            "sourceHandle": "source-top",
            "targetHandle": "target-bottom"
        },
        {
            "id": "reactflow__edge-node_bzo69au9ksource-bottom-node_tsotzqkuetarget-top",
            "type": "Join",
            "source": "node_bzo69au9k",
            "target": "node_tsotzqkue",
            "sourceHandle": "source-bottom",
            "targetHandle": "target-top"
        }
    ];

      // Call the custom method to add nodes and edges
      win.addNodesAndEdges(nodes, edges);

      // Continue with your test assertions
      cy.wait(1000); // Wait for the state to update

      // Call generateText and check the results
      cy.window().then((win) => {
        if (typeof win.generateText === 'function') {
          win.generateText(); // Call the function
        } else {
          throw new Error("Generate Text function is not available");
        }
      });

      cy.wait(1000); // Adjust time as needed to allow for async operations

      cy.get('.Textbox p').should(($p) => {
        const text = $p.html(); // Get the HTML content
        expect(text).to.contain('TypeConstructor:C7(<br>&nbsp;&nbsp;&nbsp;&nbsp;Property(P183(r1,r2)),<br>&nbsp;&nbsp;&nbsp;&nbsp;r1[Q22947]:ObjectType(Q131538),<br>&nbsp;&nbsp;&nbsp;&nbsp;r2[Q17334923]:ObjectType(Q82794),<br>&nbsp;&nbsp;&nbsp;&nbsp;isMandatory(r1),<br>&nbsp;&nbsp;&nbsp;&nbsp;Property(P9714(r3,r4)),<br>&nbsp;&nbsp;&nbsp;&nbsp;r3:ObjectType(Q131538),<br>&nbsp;&nbsp;&nbsp;&nbsp;r4:ObjectType(Q82794),<br>&nbsp;&nbsp;&nbsp;&nbsp;isMandatory(r3),<br>&nbsp;&nbsp;&nbsp;&nbsp;Join(P183, P9714))<br><br>');
      });
    });
  });
});
