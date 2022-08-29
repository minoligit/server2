const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const db = require('../connection.js');
const {isList,isFilter,printList} = require('../functions.js');

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


/////////////////////////////////////////////////User Group Rights//////////////////////////////////////////////////////
//Get list of all user group rights
router.get('/_config_ugrights_list',(req,res) => {

    printList(req,res,"_view_config_ugrights_list");
    
});
//Create new user group rights
router.post('/_config_ugrights_list',(req,res) => {

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

    const sqlQry = "INSERT INTO _config_ugrights "+qryStr+";";  
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send(JSON.stringify(sendError(error.errno,error.sqlMessage)));
        }
        res.send(result);
    }); 
});
//Get one user group rights
router.get('/_config_ugrights_list/:id',(req,res) => {
    // console.log('oo');
});
//Update one user group rights
router.put('/_config_ugrights_list/:id',(req,res) => {

    const column = req.body;
    var sqlUpdateRow = "";

    for(var head in column){
        sqlUpdateRow += (head+"='"+column[head]+"',");
    }
    sqlUpdateRow = sqlUpdateRow.slice(0, -1);

    const qryId = "SELECT TableName,GroupID FROM _view_config_ugrights WHERE id="+req.params.id+";";
    db.query(qryId, (error,result) => {
        const sqlQry = ("UPDATE _config_ugrights SET "+sqlUpdateRow+" WHERE (TableName="+result[0].TableName+
            " && GroupID="+result[0].GroupID+");");        
            db.query(sqlQry, (error, result) => {
            if(error){
                console.log(error);
                res.send(JSON.stringify(sendError(error.errno,error.sqlMessage)));
            }
            res.send(result);
        }); 
    });

});
//Delete project user group rights
router.delete('/_config_ugrights_list/:id',(req,res) => {

    const qryId = "SELECT TableName,GroupID FROM _view_config_ugrights WHERE id="+req.params.id+";";
    db.query(qryId, (error,result) => {
        const sqlQry = "DELETE FROM _config_ugrights WHERE (TableName="+result[0].TableName+" && GroupID="+result[0].GroupID+") LIMIT 1;";
        db.query(sqlQry, (error, result) => {
            if(error){
                console.log(error);
                res.send(JSON.stringify(sendError(error.errno,error.sqlMessage)));
            }
            res.send(result);
        }); 
    });
});



module.exports = router;