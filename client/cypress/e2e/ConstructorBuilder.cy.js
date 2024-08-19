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

  //test basic constructors

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
});
