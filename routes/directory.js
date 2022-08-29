const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const db = require('../connection.js');
const {printList,sendError} = require('../functions.js');

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


//////////////////////////////////////////////Directory Operations///////////////////////////////////////////////////
//Get list of all directory
router.get('/_directory_list',(req,res) => {

    printList(req,res,"_view_directory_list");
    
});
//Create new directory
router.post('/_directory_list',(req,res) => {

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
            if(head==='is_active'||head==='is_proj_related'||head==='is_proj_uniq'||head==='is_editable'||head==='is_root_dir'){
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

    const sqlQry = "INSERT INTO _directory "+qryStr+";";  
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send(JSON.stringify(sendError(error.errno,error.sqlMessage)));
        }
        res.send(result);
    }); 
});
//Get one directory
router.get('/_directory_list/:id',(req,res) => {
    // console.log('oo');
});
//Update one directory
router.put('/_directory_list/:id',(req,res) => {

    const column = req.body;
    var sqlUpdateRow = "";

    for(var head in column){
        if(head==='is_active'||head==='is_proj_related'||head==='is_proj_uniq'||head==='is_editable'||head==='is_root_dir'){
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
    const sqlQry = ("UPDATE _directory SET "+sqlUpdateRow+" WHERE dir_id="+req.params.id+";");
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send(JSON.stringify(sendError(error.errno,error.sqlMessage)));
        }
        res.send(result);
    });
 
});
//Delete project directory
router.delete('/_directory_list/:id',(req,res) => {

    const sqlQry = "DELETE FROM _directory WHERE dir_id = "+req.params.id+" LIMIT 1;";
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send(JSON.stringify(sendError(error.errno,error.sqlMessage)));
        }
        res.send(result);
    }); 
});



module.exports = router;