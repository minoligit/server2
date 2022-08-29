const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const db = require('../connection.js');
const {isList,isFilter,printList} = require('../functions.js');

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


///////////////////////////////////////////////Project Daily Work///////////////////////////////////////////////
//Get list of all nfs mount option
router.get('/_nfs_mount_option_list',(req,res) => {

    printList(req,res,"_view_nfs_mount_option_list")
    
});
//Create new nfs mount option
router.post('/_nfs_mount_option_list',(req,res) => {

    const column = req.body;
    var qryStr = "(";

    for(var head in column){
        if(column[head]!=null){
            if(head==='option'){
                qryStr += ("_nfs_mount_option.option,");
            }
            else{
                qryStr += (head+",");
            }
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

    const sqlQry = "INSERT INTO _nfs_mount_option "+qryStr+";";   
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send(JSON.stringify(sendError(error.errno,error.sqlMessage)));
        }
        res.send(result);
    }); 
});
//Get one nfs mount option
router.get('/_nfs_mount_option_list/:id',(req,res) => {
    // console.log('oo');
});
//Update one nfs mount option
router.put('/_nfs_mount_option_list/:id',(req,res) => {

    const column = req.body;
    var sqlUpdateRow = "";

    for(var head in column){
        if(head==='option'){
            sqlUpdateRow += ("_nfs_mount_option.option='"+column[head]+"',");
        }
        else{
            sqlUpdateRow += (head+"='"+column[head]+"',");
        }
    }
    sqlUpdateRow = sqlUpdateRow.slice(0, -1);
    const sqlQry = ("UPDATE _nfs_mount_option SET "+sqlUpdateRow+" WHERE opt_id="+req.params.id+";");
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send(JSON.stringify(sendError(error.errno,error.sqlMessage)));
        }
        res.send(result);
    });
 
});
//Delete nfs mount option
router.delete('/_nfs_mount_option_list/:id',(req,res) => {

    const sqlQry = "DELETE FROM _nfs_mount_option WHERE opt_id = "+req.params.id+" LIMIT 1;";
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send(JSON.stringify(sendError(error.errno,error.sqlMessage)));
        }
        res.send(result);
    }); 
});



module.exports = router;