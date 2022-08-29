const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const db = require('../connection.js')
const {isList,isFilter,printList} = require('../functions.js');

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


//////////////////////////////////////////////Technologies Options///////////////////////////////////////////
//Get list of technologies
router.get('/_technology_list',(req,res) => {

    printList(req,res,"_view_technology_list");
    
});
//Create new technology
router.post('/_technology_list',(req,res) => {

    const column = req.body;
    var qryStr = "(";

    for(var head in column){
        if(column[head]!=null){
            qryStr += (head+",");
        }
    }
    qryStr = qryStr.slice(0, -1);
    qryStr += (") VALUES (");
    for(var head in column){
        if(head!=null){
            qryStr += ("'"+column[head]+"',");
        }
    }
    qryStr = qryStr.slice(0, -1);
    qryStr += (")");

    const sqlQry = "INSERT INTO _technology "+qryStr+";";  
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send(JSON.stringify(sendError(error.errno,error.sqlMessage)));
        }
        res.send(result);
    }); 
});
//Get one of technology
router.get('/_technology_list/:id',(req,res) => {
    // console.log(req.params.id);
});
//Update one row of technology
router.put('/_technology_list/:id',(req,res) => {

    const column = req.body;
    var sqlUpdateRow = "";

    for(var head in column){
        sqlUpdateRow += (head+"='"+column[head]+"',");
    }
    sqlUpdateRow = sqlUpdateRow.slice(0, -1);

    const sqlQry = ("UPDATE _technology SET "+sqlUpdateRow+" WHERE tech_id="+req.params.id+";");
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send(JSON.stringify(sendError(error.errno,error.sqlMessage)));
        }
        res.send(result);
    });
});
//Delete technology
router.delete('/_technology_list/:id',(req,res) => {

    const sqlQry = "DELETE FROM _technology WHERE tech_id = "+req.params.id+" LIMIT 1;";
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send(JSON.stringify(sendError(error.errno,error.sqlMessage)));
        }
        res.send(result);
    });  
});





//Technology multiple update
router.put('/_technology_list',(req,res) => {
    console.log("mmm",req.body);
});
//Cell editing technology
router.put('/updateCellTech/:id/:column/:value',(req,res) => {

    const sqlStr = "UPDATE _technology SET "+req.params.column+"='"+req.params.value+"' WHERE tech_id="+req.params.id+"";
    db.query(sqlStr, (error, result) => {
        console.log(error);
        res.send(error);
    });
});





module.exports = router;