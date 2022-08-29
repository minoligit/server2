const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const db = require('../connection.js');
const {isList,isFilter,printList} = require('../functions.js');

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


/////////////////////////////////////////////////User Groups Operations//////////////////////////////////////////////////////
//Get list of all user group groups
router.get('/_config_uggroups_list',(req,res) => {

    printList(req,res,"_view_config_uggroups_list");
    
});
//Create new user group groups
router.post('/_config_uggroups_list',(req,res) => {

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

    const sqlQry = "INSERT INTO _config_uggroups "+qryStr+";";  
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send(JSON.stringify(sendError(error.errno,error.sqlMessage)));
        }
        res.send(result);
    }); 
});
//Get one user group groups
router.get('/_config_uggroups_list/:id',(req,res) => {
    // console.log('oo');
});
//Update one user group groups
router.put('/_config_uggroups_list/:id',(req,res) => {

    const column = req.body;
    var sqlUpdateRow = "";

    for(var head in column){
        sqlUpdateRow += (head+"='"+column[head]+"',");
    }
    sqlUpdateRow = sqlUpdateRow.slice(0, -1);
    const sqlQry = "CALL update_config_uggroups("+req.params.id+",\""+sqlUpdateRow+"\");";
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send(JSON.stringify(sendError(error.errno,error.sqlMessage)));
        }
        res.send(result);
    }); 
 
});
//Delete project user group groups
router.delete('/_config_uggroups_list/:id',(req,res) => {

    const sqlQry = "DELETE FROM _config_uggroups WHERE GroupID = "+req.params.id+" LIMIT 1;";
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send(JSON.stringify(sendError(error.errno,error.sqlMessage)));
        }
        res.send(result);
    }); 
});



module.exports = router;