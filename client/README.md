# CoSMo Studio

CoSMo Studio is a tool for building CoSMo constructors, where users can dynamically build, modify and combine constructors using the node-based editor (built using ReactFlow). Users can generate the textual version of constructors with syntax validation, and with support for multiple languages. Users can save and organize constructors into collections, as well as access constructors made by other users from a central repository.

# Running the app
To run CoSMo Studio, ensure that the server is running, then run the client app:
1. In the server directory, run the server using the command:
    node index.js

2. In the client directory, run the app using the command:
    npm start

# Components

The CoSMo Studio application consists of multiple components, each with a dedicated purpose and responsibility.

Functional Components:

1. ConstructorBuilder - Responsible for managing the nodes and edges added to the constructor.
2. ElementSelector - Represents the CoSMo elements, and ensures the appropriate data is assigned to each node.
3. TextGenerator - Responsible for generating the textual version of a constructor with syntax validation, and has translation functions to translate the text in the user's desired language.
4. ConstructorManager - Responsible for fetching the constructors made by the current user, and displaying it to the user by collection, and allows users to delete their own constructors.
5. ConstructorSaver - Responsible for allowing users to save and modify constructors, with access control for modifications to constructors made by other users.
6. ConstructorForm - Allows users to access the central repository of constructors made by other users.
7. SearchForm - Fetches data items (P, Q and Z items) from the mySQL database, allowing users to search through these items when assigning it to a node.
8. UserManual - Provides a guide on how to build constructors, and syntax validation rules.

Navigation and Authentication Components:
1. Navbar and NavbarData - Responsible for the sidebar allowing users to easily navigate through the system.
2. Login - Responsible for authenticating users.
3. PrivateRoute - Hides components from unauthenticated users.

Contexts:
1. UserContext - Tracks the data of the current user (user ID, username and password) and shares it across other components.

Edges:
There are 10 different edges, each modelled after a CoSMo connector using a Bezier path and an SVG marker.

Nodes:
The nodes are custom ReactFlow nodes, each modelled after CoSMo elements.
1. ObjectNode - Models all CoSMo elements, except for the Role name and Value Constraint elements.
2. InputNode - Models Role name and Value Constraint elements.

# Testing
To run the automated tests, run the command:
    npx cypress run

The tests are contained in the 'ConstructorBuilder.cy.js' file in the 'cypress/e2e' folder.

# License
This project is licensed under the Apache Open Source License - see the [LICENSE](./LICENSE) file for details.

# Third-party Licenses
This project uses React Flow, which is licensed under the MIT License. For more information, refer to their [license](https://github.com/wbkd/react-flow/blob/main/LICENSE).