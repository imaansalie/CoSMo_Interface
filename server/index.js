const express = require('express')
const app = express()
const mysql = require('mysql')
const cors = require('cors')

app.use(cors());
app.use(express.json());

const db= mysql.createConnection({
    user: 'slxima002',
    host: 'nightmare.cs.uct.ac.za',
    password: 'aeC3OeVa',
    database: 'slxima002',
})

app.post('/getUser', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    let query = `SELECT * from users WHERE username = '${username}' && password = '${password}'`;

    db.query(
        query, 
        (err, result)=>{
            if(err){
                console.log(err);
            }
            else{
                res.json(result);
            }
        }
    )
})

app.post('/getItems', (req, res) =>{
    const itemType= req.body.itemType;

    let query= "SELECT * FROM";

    if (itemType == 'Object' || itemType == 'ValueConstraint' || itemType == 'Role_name'){
        query+=" items";
    }

    else if (itemType == 'Property'){
        query+=" properties";
    }

    else if(itemType == 'Function'){
        query+=" functions";
    }

    db.query(
        query,
        (err, result) =>{
            if(err){
                console.log(err);
            }
            else{
                res.json(result);
            }
        }
    )

    // console.log(itemType);
})

app.post('/getLabel', (req, res) => {
    const label = req.body.label;
    const language = req.body.selectedLanguage;

    // console.log(label);
    // console.log(language);

    let query = `SELECT ${language} from languages WHERE English = '${label}'`;

    db.query(
        query, 
        (err, result)=>{
            if(err){
                console.log(err);
            }
            else{
                res.json(result);
            }
        }
    )
})

function sanitizeNode(node) {
    const { position, positionAbsolute, ...rest } = node;
    return rest;
}

function normalizeNode(node) {
    const normalizedData = Object.keys(node.data)
    .sort()
    .reduce((acc, key) => {
      acc[key] = node.data[key];
      return acc;
    }, {});

    return {
        id: node.id,
        data: normalizedData,
        type: node.type,
        width: node.width,
        height: node.height,
        selected: node.selected || false,  // Ensure default value
        dragging: node.dragging || false,  // Ensure default value
    };
}

function sortNodes(nodes) {
    return nodes.map(normalizeNode).sort((a, b) => a.id.localeCompare(b.id));
}

function areNodesEqualIgnoringPositions(nodes1, nodes2) {
    // Sanitize both sets of nodes

    const dbNodes = JSON.parse(nodes1);
    const givenNodes = JSON.parse(nodes2);

    if(dbNodes.length != givenNodes.length){
        return false;
    }

    const sanitizedNodes1 = dbNodes.map(sanitizeNode);
    const sanitizedNodes2 = givenNodes.map(sanitizeNode);

    const sortedNodes1 = sortNodes(sanitizedNodes1);
    const sortedNodes2 = sortNodes(sanitizedNodes2);

    console.log(sortedNodes1);
    console.log(sortedNodes2);

    // Compare the sorted and sanitized nodes
    return JSON.stringify(sortedNodes1) === JSON.stringify(sortedNodes2);
}

function normalizeEdge(edge) {
    return {
        id: edge.id,
        type: edge.type,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle
    };
}

function sortEdges(edges) {
    return edges.map(edge => JSON.stringify(normalizeEdge(edge)))
        .sort()
        .map(str => JSON.parse(str));
}

const checkEdgesEqual = (arr1, arr2) => {
    // Ensure both arrays have the same length
    if (arr1.length !== arr2.length) return false;

    const sortedStr1 = sortEdges(arr1);
    const sortedStr2 = sortEdges(arr2);

    console.log("sortedStr1: ", sortedStr1);
    console.log("sortedStr2: ", sortedStr2);
  
    return JSON.stringify(sortedStr1) === JSON.stringify(sortedStr2);
};

app.post('/saveConstructor', (req, res) => {
    const id= req.body.maxConID;
    const nodes = JSON.stringify(req.body.nodes);
    const edges = JSON.stringify(req.body.edges);
    const conName = req.body.conName;
    const conCollection = req.body.conCollection;
    const string = req.body.string;
    const description = req.body.description;
    const userID= req.body.userID;

    const saveConstructor = () => {
        const query2 = `INSERT INTO constructors (idconstructors, name, collection, text, nodes, edges, description, userID) VALUES (?,?,?,?,?,?,?, ?)`;

        db.query(
            query2,
            [id, conName, conCollection, string, nodes, edges, description, userID],
            (err, result) => {
                if(err){
                    console.log(err);
                    return res.status(500).send("Error saving constructor.");
                } else {
                    const query3 = `SELECT * from collections WHERE name = ?`;
                    db.query(
                        query3, 
                        [conCollection],
                        (err, result) => {
                            if(err){
                                console.log(err);
                                return res.status(500).send("Error checking collection.");
                            } else {
                                if(result.length === 0){
                                    const query4 = `INSERT INTO collections (name) VALUES (?)`;
                                    db.query(
                                        query4,
                                        [conCollection],
                                        (err, result) => {
                                            if(err){
                                                console.log(err);
                                                return res.status(500).send("Error adding collection.");
                                            }
                                            res.send("Constructor and new collection added.");
                                        }
                                    );
                                } else {
                                    res.send("Constructor added.");
                                }
                            }
                        }
                    );
                }
            }
        );
    }

    const modifyConstructor = () =>{
        query5= `UPDATE constructors SET nodes = ?, edges = ? WHERE idconstructors = ?;`

        db.query(
            query5,
            [nodes, edges, id],
            (err, result) =>{
                if(err){
                    console.log(err);
                    return res.status(500).send("Error modifying constructor.");
                }
                else{
                    res.send("Constructor modified.");
                }
            }
        )
    }

    const query1= `SELECT * from constructors where idconstructors=?`;

    db.query(
        query1, 
        [id],
        (err, result)=>{
            if(err){
                console.log(err);
                return res.status(500).send("Error saving constructor.");
            }
            else if(result.length>0){
                if(result[0].userID == userID){
                    //same user -- check if constructor has been modified
                    const nodesEqual=areNodesEqualIgnoringPositions(result[0].nodes, nodes);
                    const dbEdges = JSON.parse(result[0].edges);
                    const givenEdges = JSON.parse(edges);

                    // console.log("from db: ", result[0].edges);
                    // console.log("given: ", edges);

                    const edgesEqual = checkEdgesEqual(dbEdges, givenEdges);

                    console.log("nodes equal: ", nodesEqual);
                    console.log("edges equal: ", edgesEqual);

                    if (!nodesEqual || !edgesEqual) {
                        //modify constructor
                        modifyConstructor();
                    }
                    else{
                        return res.send(`Constructor ${id}: ${conName} already exists and has not been modified.`)
                    }
                }
                else{
                    //not the same user
                    //notify user that they cannot edit other users' constructors
                    //Can only be combined with their own constructors
                    return res.send(`Constructor ${id}: ${conName} already exists. Users cannot modify constructors made by other users.`)
                }
            }
            else{
                saveConstructor();
            }
        }
    )    
})

app.post('/findConstructor', (req, res) => {
    const conID = req.body.maxConID;
    const userID = req.body.userID;

    let query = `SELECT * FROM constructors where idconstructors=?`

    db.query(
        query,
        [conID],
        (err, result)=>{
            if(err){
                console.log(err);
            }
            else{
                if(result[0].length>0){
                    if(result[0].userID == userID){
                        return res.send("Constructor found.");
                    }
                    else{
                        return res.send("Constructor not created by user.")
                    }
                }
                else{
                    return res.send("Constructor does not exist.")
                }
            }
        }
    )
})

app.post('/getConstructors', (req, res) => {
    const userID = req.body.userID;

    let query = `SELECT * FROM constructors where userID='${userID}'`;

    db.query(
        query, 
        (err, result)=>{
            if(err){
                console.log(err);
            }
            else{
                res.json(result);
            }
        }
    )
})

app.post('/getCollections', (req, res) => {
    let query = `SELECT * from collections`;

    db.query(
        query, 
        (err, result)=>{
            if(err){
                console.log(err);
            }
            else{
                res.json(result);
            }
        }
    )
})

app.post('/getAllConstructors', (req, res) => {
    const collection= req.body.collection;
    let query = `SELECT idconstructors, nodes, edges, name, description FROM constructors WHERE collection='${collection}'`;

    db.query(
        query, 
        (err, result)=>{
            if(err){
                console.log(err);
            }
            else{
                res.json(result);
            }
        }
    )
})

app.post('/getID', (req, res) => {
    let query = `SELECT * FROM constructors ORDER BY idconstructors DESC LIMIT 1`;

    db.query(
        query, 
        (err, result)=>{
            if(err){
                console.log(err);
            }
            else{
                console.log(result);
                res.json(result);
            }
        }
    )    
})

app.listen(3001, () => {
    console.log("server running on port 3001");
});

