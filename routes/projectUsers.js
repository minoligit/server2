const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const db = require('../connection.js')
const {printList,sendError} = require('../functions.js');

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

///////////////////////////////////////////Project Users Operations/////////////////////////////////////////////////
//Get list of users for all projects
router.get('/_project_user_list',(req,res) => {

    printList(req,res,"_view_project_user_list");
    
});
//Create new project user
router.post('/_project_user_list',(req,res) => {

    const column = req.body;
    var qryStr = "(";

    for(var head in column){
        if(column[head]!==''){
            if(head==='pro_name'){
                qryStr += ("pro_id,")
            }
            else if(head==='ldap_uname'){
                qryStr += ("user_id,")
            }
            else{
                qryStr += (head+",");
            }
        }
    }
    qryStr = qryStr.slice(0, -1);
    qryStr += (") VALUES (");
    for(var head in column){
        if(head!==''){
            if(head==='pro_name'){
                const sqlProId = "SELECT pro_id FROM _project WHERE pro_name = '"+column[head]+"'";
                qryStr += ("("+sqlProId+"),");
            }
            else if(head==='ldap_uname'){
                const sqlUserId = "SELECT user_id FROM _user WHERE ldap_uname = '"+column[head]+"'";
                qryStr += ("("+sqlUserId+"),");
            }
            else{
                qryStr += ("'"+column[head]+"',");
            }
        }
    }
    qryStr = qryStr.slice(0, -1);
    qryStr += (")");

    const sqlQry = "INSERT INTO _project_user "+qryStr+";";     
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send(JSON.stringify(sendError(error.errno,error.sqlMessage)));
        }
        res.send(result);
    }); 
});
//Get one project user
router.get('/_project_user_list/:id',(req,res) => {
    // console.log('oo');
});
//Update one project user
router.put('/_project_user_list/:id',(req,res) => {

    const column = req.body;
    console.log(column);
    var sqlUpdateRow = "";

    for(var head in column){
        if(head==='pro_name'){
            const sqlProName = "SELECT pro_id FROM _project WHERE pro_name = '"+column[head]+"'";
            sqlUpdateRow += ("pro_id=("+sqlProName+"),");
        }
        else if(head==='ldap_uname'){
            const sqlUname = "SELECT user_id FROM _user WHERE ldap_uname = '"+column[head]+"'";
            sqlUpdateRow += ("user_id=("+sqlUname+"),");
        }
        else{
            sqlUpdateRow += (head+"='"+column[head]+"',");
        }
    }
    sqlUpdateRow = sqlUpdateRow.slice(0, -1);
    

    const qryId = "SELECT pro_id,user_id FROM _view_project_user_list WHERE id="+req.params.id+"";
    db.query(qryId, (error,result) => {
        const sqlQry = ("UPDATE _project_user SET "+sqlUpdateRow+" WHERE (pro_id="+result[0].pro_id+
            " && user_id="+result[0].user_id+");");        
            db.query(sqlQry, (error, result) => {
            if(error){
                console.log(error);
                res.send(JSON.stringify(sendError(error.errno,error.sqlMessage)));
            }
            res.send(result);
        }); 
    });
 
});
//Delete project user
router.delete('/_project_user_list/:id',(req,res) => {

    const qryId = "SELECT pro_id,user_id FROM _view_project_user_list WHERE id="+req.params.id+";";
    db.query(qryId, (error,result) => {
        const sqlQry = "DELETE FROM _project_user WHERE (pro_id="+result[0].pro_id+" && user_id="+result[0].user_id+") LIMIT 1;";
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