const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const db = require('../connection.js')
const {isList,isFilter,printList} = require('../functions.js');

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


///////////////////////////////////////////////////Servers Operations///////////////////////////////////////////
//Get list of servers
router.get('/_server_list',(req,res) => {

    printList(req,res,"_view_server_list");
     
});
//Create new server
router.post('/_server_list',(req,res) => {

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

    const sqlQry = "INSERT INTO _server "+qryStr+";"; 
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send(JSON.stringify(sendError(error.errno,error.sqlMessage)));
        }
        res.send(result);
    }); 

});
//Get one server
router.get('/_server_list/:id',(req,res) => {
});
//Update server one row
router.put('/_server_list/:id',(req,res) => {

    const column = req.body;
    var sqlUpdateRow = "";

    for(var head in column){
        sqlUpdateRow += (head+"='"+column[head]+"',");
    }
    sqlUpdateRow = sqlUpdateRow.slice(0, -1);

    const sqlQry = ("UPDATE _server SET "+sqlUpdateRow+" WHERE svr_id="+req.params.id+";");
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send(JSON.stringify(sendError(error.errno,error.sqlMessage)));
        }
        res.send(result);
    });  
});
//Delete servers
router.delete('/_server_list/:id',(req,res) => {

    const sqlQry = "DELETE FROM _server WHERE svr_id = "+req.params.id+" LIMIT 1;";
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send(JSON.stringify(sendError(error.errno,error.sqlMessage)));
        }
        res.send(result);
    }); 
});






//Cell editing server
router.put('/updateCellServer/:id/:column/:value',(req,res) => {

    const sqlStr = "UPDATE _server SET "+req.params.column+"='"+req.params.value+"' WHERE svr_id="+req.params.id+"";
    db.query(sqlStr, (error, result) => {
        console.log(error);
        res.send(error);
    });
});




module.exports = router;