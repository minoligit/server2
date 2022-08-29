const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const db = require('../connection.js');
const {isList,isFilter,printList} = require('../functions.js');

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


/////////////////////////////////////////Project Target Operations/////////////////////////////////////////////
//Get list of all project targets
router.get('/_project_target_list',(req,res) => {

    printList(req,res,"_view_project_target_list"); 

});
//Create new project target
router.post('/_project_target_list',(req,res) => {

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
            if(head==='is_derived'){
                if(column[head]==='Yes'){
                    qryStr += ("1,");
                }
                else{
                    qryStr += ("0,");
                }
            }
            else{
                qryStr += ("'"+column[head]+"',");
            }
        }
    }
    qryStr = qryStr.slice(0, -1);
    qryStr += (")");

    const sqlQry = "INSERT INTO _project_target "+qryStr+";";     
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send(JSON.stringify(sendError(error.errno,error.sqlMessage)));
        }
        res.send(result);
    }); 
});
//Get one project target
router.get('/_project_target_list/:id',(req,res) => {
    // console.log('oo');
});
//Update one project user
router.put('/_project_target_list/:id',(req,res) => {

    const column = req.body;
    var sqlUpdateRow = "";

    for(var head in column){
        if(head==='is_derived'){
            if(column[head]==='Yes'){
                sqlUpdateRow += (head+"=1,");
            }
            else{
                sqlUpdateRow += (head+"=0,");
            }
        }
        else{
            sqlUpdateRow += (head+"='"+column[head]+"',");
        }
    }

    sqlUpdateRow = sqlUpdateRow.slice(0, -1);
    const sqlQry = ("UPDATE _project_target SET "+sqlUpdateRow+" WHERE target_id="+req.params.id+";");
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send(JSON.stringify(sendError(error.errno,error.sqlMessage)));
        }
        res.send(result);
    });
 
});
//Delete one project target
router.delete('/_project_target_list/:id',(req,res) => {

    const sqlQry = "DELETE FROM _project_target WHERE target_id = "+req.params.id+" LIMIT 1;";
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send(JSON.stringify(sendError(error.errno,error.sqlMessage)));
        }
        res.send(result);
    });  
 
});




module.exports = router;
