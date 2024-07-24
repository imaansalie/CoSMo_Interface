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

// app.post('/create', (req, res) => {
//     const name = req.body.name;
//     const surname = req.body.surname;

//     db.query(
//         'INSERT INTO users (name, surname) VALUES (?,?)', 
//         [name, surname], (err, result) => {
//             if (err) {
//                 console.log(err);
//             }
//             else{
//                 res.send("Values inserted");
//             }
//         }
//     );
// })

app.post('/getItems', (req, res) =>{
    const itemType= req.body.itemType;

    let query= "SELECT * FROM";

    if (itemType == 'Object'){
        query+=" items";
    }

    else if (itemType == 'Property'){
        query+=" properties"
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

app.listen(3001, () => {
    console.log("server running on port 3001");
});

