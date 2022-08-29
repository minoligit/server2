const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const db = require('../connection.js');
const {isList,isFilter,printList} = require('../functions.js');

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


///////////////////////////////////////////////////Roles Operations//////////////////////////////////////////////
//Get List of Roles
router.get('/_role_list',(req,res) => {

    printList(req,res,"_view_role_list");
    
});
//Create new roles
router.post('/_role_list',(req,res) => {

    const column = req.body;
    var qryStr = "(";

    for(var head in column){
        if(column[head]!==''){
            qryStr += (head+",");
        }
    }
    qryStr = qryStr.slice(0, -1);
    qryStr += (") VALUES (");
    for(var head in column){
        if(column[head]!==''){
            qryStr += ("'"+column[head]+"',");
        }
    }
    qryStr = qryStr.slice(0, -1);
    qryStr += (")");

    const sqlQry = "INSERT INTO _role "+qryStr+";";  
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send(JSON.stringify(sendError(error.errno,error.sqlMessage)));
        }
        res.send(result);
    }); 
});
//Get one role
router.get('/_role_list/:id',(req,res) => {
    // console.log(req.params.id);
});
//Update role one row
router.put('/_role_list/:id',(req,res) => {

    const column = req.body;
    var sqlUpdateRow = "";

    for(var head in column){
        sqlUpdateRow += (head+"='"+column[head]+"',");
    }
    sqlUpdateRow = sqlUpdateRow.slice(0, -1);

    const sqlQry = ("UPDATE _role SET "+sqlUpdateRow+" WHERE role_id="+req.params.id+";");
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send(JSON.stringify(sendError(error.errno,error.sqlMessage)));
        }
        res.send(result);
    });
});
//Delete roles
router.delete('/_role_list/:id',(req,res) => {

    const sqlQry = "DELETE FROM _role WHERE role_id = "+req.params.id+" LIMIT 1;";
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send(JSON.stringify(sendError(error.errno,error.sqlMessage)));
        }
        res.send(result);
    }); 
});




//Update many role
router.put('/_role_list',(req,res) => {
    console.log("mmm",req.body);
});
//Cell editing roles
router.put('/updateCellRole/:id/:column/:value',(req,res) => {

    const sqlStr = "UPDATE _role SET "+req.params.column+"='"+req.params.value+"' WHERE role_id="+req.params.id+"";
    db.query(sqlStr, (error, result) => {
        res.send(error);
    });
});




module.exports = router;
