const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const db = require('../connection.js');
const {isList,isFilter,printList} = require('../functions.js');

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


////////////////////////////////////////////Role Directory Mount Option Operations////////////////////////////////////////////////
//Get list of role dir mount opt
router.get('/_role_directory_mount_opt_list',(req,res) => {

    printList(req,res,"_view_role_dir_mount_opt_list");
    
});
//Create new role dir mount opt
router.post('/_role_directory_mount_opt_list',(req,res) => {

    const column = req.body;
    var qryStr = "(";

    for(var head in column){
        if(column[head]!=null){
            if(head==='role_alias'){
                qryStr += ("role_id,");
            }
            else if(head==='client_path'){
                qryStr += ("dir_id,");
            }
            else if(head==='option'){
                qryStr += ("opt_id,");
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
            if(head==='role_alias'){
                qryStr += ("(SELECT role_id FROM _role WHERE role_alias='"+column[head]+"'),");
            }
            else if(head==='client_path'){
                qryStr += ("(SELECT dir_id FROM _directory WHERE client_path='"+column[head]+"'),");
            }
            else if(head==='option'){
                qryStr += ("(SELECT opt_id FROM _nfs_mount_option WHERE _nfs_mount_option.option='"+column[head]+"'),");
            }
            else{
                qryStr += ("'"+column[head]+"',");            
            }
        }
    }
    qryStr = qryStr.slice(0, -1);
    qryStr += (")");

    const sqlQry = "INSERT INTO _role_directory_mount_opt "+qryStr+";"; 
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send(JSON.stringify(sendError(error.errno,error.sqlMessage)));
        }
        res.send(result);
    }); 
 

});
//Get one role dir mount opt
router.get('/_role_directory_mount_opt_list/:id',(req,res) => {
    // console.log('oo');
});
//Update one role dir mount opt
router.put('/_role_directory_mount_opt_list/:id',(req,res) => {

    console.log(req.body);
    const column = req.body;
    var sqlUpdateRow = "";

    for(var head in column){
        if(head==='role_alias'){
            const sqlId1 = "SELECT role_id FROM _role WHERE role_alias = '"+column[head]+"'";
            sqlUpdateRow += ("role_id=("+sqlId1+"),");
        }
        else if(head==='client_path'){
            const sqlId2 = "SELECT dir_id FROM _directory WHERE client_path = '"+column[head]+"'";
            sqlUpdateRow += ("dir_id=("+sqlId2+"),");
        }
        else if(head==='option'){
            const sqlId3 = "SELECT opt_id FROM _nfs_mount_option WHERE _nfs_mount_option.option = '"+column[head]+"'";
            sqlUpdateRow += ("opt_id=("+sqlId3+"),");
        }
        else{
            sqlUpdateRow += (head+"='"+column[head]+"',");
        }
    }
    sqlUpdateRow = sqlUpdateRow.slice(0, -1);

    const qryId = "SELECT role_id,dir_id,opt_id FROM _view_role_directory_mount_opt WHERE id="+req.params.id+";";
    db.query(qryId, (error,result) => {
        const sqlQry = ("UPDATE _role_directory_mount_opt SET "+sqlUpdateRow+" WHERE (role_id="+result[0].role_id+
            " && dir_id="+result[0].dir_id+" && opt_id="+result[0].opt_id+");");    
            db.query(sqlQry, (error, result) => {
            if(error){
                console.log(error);
                res.send(JSON.stringify(sendError(error.errno,error.sqlMessage)));
            }
            res.send(result);
        }); 
    });
 
});
//Delete role dir mount opt
router.delete('/_role_directory_mount_opt_list/:id',(req,res) => {

    const qryId = "SELECT role_id,dir_id,opt_id FROM _view_role_directory_mount_opt WHERE id="+req.params.id+";";
    db.query(qryId, (error,result) => {
        const sqlQry = "DELETE FROM _role_directory_mount_opt WHERE (role_id="+result[0].pro_id+" && dir_id="+
            result[0].user_id+" && opt_id"+result[0].opt_id+") LIMIT 1;";
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