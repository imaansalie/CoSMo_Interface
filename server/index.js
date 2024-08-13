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

app.post('/saveConstructor', (req, res) => {
    const id= req.body.maxConID;
    const nodes = JSON.stringify(req.body.nodes);
    const edges = JSON.stringify(req.body.edges);
    const conName = req.body.conName;
    const conCollection = req.body.conCollection;
    const string = req.body.string;
    const description = req.body.description;
    const userID= req.body.userID;

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
                return res.send(`Constructor ${id}: ${conName} already exists.`)
            }
            else{
                const query2 = `INSERT INTO constructors (idconstructors, name, collection, text, nodes, edges, description, userID) VALUES (?,?,?,?,?,?,?, ?)`;

                db.query(
                    query2,
                    [id, conName, conCollection, string, nodes, edges, description, userID],
                    (err, result)=>{
                        if(err){
                            console.log(err);
                            return res.status(500).send("Error saving constructor.");
                        }
                        else{
                            const query3 = `SELECT * from collections WHERE name = ?`;
                            db.query(
                                query3, 
                                [conCollection],
                                (err, result)=>{
                                    if(err){
                                        console.log(err);
                                        return res.status(500).send("Error checking collection.");
                                    }
                                    else{
                                        //if not, add the collection
                                        if(result.length === 0){
                                            const query4 = `INSERT INTO collections (name) VALUES (?)`;
                                            db.query(
                                            query4,
                                            [conCollection],
                                            (err, result) =>{
                                                if(err){
                                                    console.log(err);
                                                    return res.status(500).send("Error adding collection.");
                                                }
                                                res.send("Constructor and new collection added.");
                                            });
                                        }else {
                                            res.send("Constructor added.");
                                        }
                                    }
                                }
                            )
                        }
                    }
                )
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
                res.json(result);
            }
        }
    )
})

app.listen(3001, () => {
    console.log("server running on port 3001");
});

