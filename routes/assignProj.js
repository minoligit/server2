const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const db = require('../connection.js');
const {printList,sendError} = require('../functions.js');

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


////////////////////////////////////////////Assign Project Target Operations////////////////////////////////////////////////
//Get list of assign project target
router.get('/_project_target_alloc_list',(req,res) => {

    printList(req,res,"_view_project_target_alloc_list");
     
});
//Create new assign project target
router.post('/_project_target_alloc_list',(req,res) => {

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
            if(head==='pro_name'){
                qryStr += ("(SELECT pro_id FROM _project WHERE pro_name='"+column[head]+"'),");
            }
            else if(head==='tartget_fact'){
                qryStr += ("(SELECT target_id FROM _target WHERE tartget_fact='"+column[head]+"'),");
            }
            else if(head==='ldap_uname'){
                qryStr += ("(SELECT user_id FROM _user WHERE ldap_uname='"+column[head]+"'),");
            }
            else{
                qryStr += ("'"+column[head]+"',");
            }
        }
    }
    qryStr = qryStr.slice(0, -1);
    qryStr += (")");

    const sqlQry = "INSERT INTO _project_targtet_alloc "+qryStr+";";    
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send(JSON.stringify(sendError(error.errno,error.sqlMessage)));
        }
        res.send(result);
    }); 
 

});
//Get one assign project target
router.get('/_project_target_alloc_list/:id',(req,res) => {
    // console.log('oo');
});
//Update one assign project target
router.put('/_project_target_alloc_list/:id',(req,res) => {

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
    const sqlQry = ("UPDATE _project_target_alloc SET "+sqlUpdateRow+" WHERE pro_id="+req.params.id+";");
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send(JSON.stringify(sendError(error.errno,error.sqlMessage)));
        }
        res.send(result);
    }); 
 
});
//Delete assign project target
router.delete('/_project_target_alloc_list/:id',(req,res) => {

    const sqlQry = "DELETE FROM _project_target_alloc WHERE pro_id = "+req.params.id+" LIMIT 1;";
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send(JSON.stringify(sendError(error.errno,error.sqlMessage)));
        }
        res.send(result);
    }); 
});





module.exports = router;