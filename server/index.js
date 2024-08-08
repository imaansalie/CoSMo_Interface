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

    console.log(itemType);
})

app.post('/getLabel', (req, res) => {
    const label = req.body.label;
    const language = req.body.selectedLanguage;

    console.log(label);
    console.log(language);

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

app.post('/saveConstructor', (req, res) => {
    const id= req.body.maxConID;
    const nodes = JSON.stringify(req.body.nodes);
    const edges = JSON.stringify(req.body.edges);
    const conName = req.body.conName;
    const conCollection = req.body.conCollection;
    const string = req.body.string;
    const description = req.body.description;

    console.log(conName);
    console.log(conCollection);

    let query = `INSERT INTO constructors (idconstructors, name, collection, text, nodes, edges, description) VALUES (${id}, '${conName}', '${conCollection}', '${string}', '${nodes}', '${edges}','${description}')`;

    db.query(
        query, 
        (err, result)=>{
            if(err){
                console.log(err);
            }
            else{
                res.send("Constructor added.");
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

app.post('/getAllConstructors', (req, res) => {
    let query = `SELECT idconstructors, nodes, edges, name, description FROM constructors`;

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
                res.json(result);
            }
        }
    )
})

app.listen(3001, () => {
    console.log("server running on port 3001");
});

