const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const db = require('../connection.js');

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


////////////////////////////////////////////Role Directory Mount Option Operations////////////////////////////////////////////////
//Get list of role dir mount opt
router.get('/_role_directory_mount_opt_list',(req,res) => {

    const column = JSON.parse(req.query.filter);
    var qryStr = "1 ";
    const start = (JSON.parse(req.query.range)[0]);
    const end = (JSON.parse(req.query.range)[1]);
    const sortBy = (JSON.parse(req.query.sort)[0]);
    const order = (JSON.parse(req.query.sort)[1]);

    if(column!=null){
        for(var head in column){
            if(head==='role_id'||head==='dir_id'||head=='opt_id'){
                qryStr += ("&& _role_directory_mount_opt."+head+"="+column[head]+" ");
            }
            else{
                qryStr += ("&& "+head+"='"+column[head]+"' ");
            }
        }
    }
    const sqlQry = "CALL get_role_dir_mount_opt_list(\"("+qryStr+")\",\""+sortBy+"\",\""+order+"\","+start+","+end+");";
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
        }
        res.header('Content-Range',result.length);
        res.send(result[0]);
    }); 
});
//Create new role dir mount opt
router.post('/_role_directory_mount_opt_list',(req,res) => {

    const column = req.body;
    var qryStr = "(";

    for(var head in column){
        if(column[head]!=null){
            if(head==='pro_name'){
                qryStr += ("pro_id,");
            }
            else if(head==='tartget_fact'){
                qryStr += ("pro_id,");
            }
            else if(head==='ldap_uname'){
                qryStr += ("user_id,");
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

    const sqlQry = "INSERT INTO _role_directory_mount_opt "+qryStr+";";  
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send('Something went wrong. Please try again.');
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

    const column = req.body;
    var sqlUpdateRow = "";

    for(var head in column){
        if(head==='pro_name'){
            const sqlPro = "SELECT pro_id FROM _project WHERE pro_name = '"+column[head]+"'";
            sqlUpdateRow += ("pro_id=("+sqlPro+"),");
        }
        else if(head==='tartget_fact'){
            const sqlTarget = "SELECT target_id FROM _target WHERE tartget_fact = '"+column[head]+"'";
            sqlUpdateRow += ("target_id=("+sqlTarget+"),");
        }
        else if(head==='defined_user'){
            const sqlTarget = "SELECT user_id FROM _user WHERE ldap_uname = '"+column[head]+"'";
            sqlUpdateRow += ("defined_user_id=("+sqlTarget+"),");
        }
        else{
            sqlUpdateRow += (head+"='"+column[head]+"',");
        }
    }
    sqlUpdateRow = sqlUpdateRow.slice(0, -1);
    const sqlQry = "CALL update_role_dir_mount_opt("+req.params.id+",\""+sqlUpdateRow+"\");";
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send('Something went wrong. Please try again.');
        }
    }); 
 
});
//Delete role dir mount opt
router.delete('/_role_directory_mount_opt_list/:id',(req,res) => {

    const sqlQry = "CALL delete_role_dir_mount_opt("+req.params.id+");";
    db.query(sqlQry, (error, result) => {
        console.log(error);
    }); 
});


module.exports = router;