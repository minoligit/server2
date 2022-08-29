const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const db = require('../connection.js');
const {isList,isFilter,printList} = require('../functions.js');

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


////////////////////////////////////////////User Allocation Operations////////////////////////////////////////////////
//Get list of user allocation
router.get('/_user_relationship_list',(req,res) => {

    const column = JSON.parse(req.query.filter);
    var qryStr = "1 ";
    const start = (JSON.parse(req.query.range)[0]);
    const end = (JSON.parse(req.query.range)[1]);
    const sortBy = (JSON.parse(req.query.sort)[0]);
    const order = (JSON.parse(req.query.sort)[1]);

    if(column!=null){
        for(var head in column){
            if(head==='role_id'){
                qryStr += ("&& _user_relationship.rel_role="+column[head]+" ");
            }
            else{
                qryStr += ("&& "+head+"='"+column[head]+"' ");
            }
        }
    }
    const sqlQry = ("SELECT * FROM _view_user_relationship_list WHERE ("+qryStr+") ORDER BY "+sortBy+
        " "+order+" LIMIT "+(end-start+1)+" OFFSET "+start+";");
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
        }
        res.header('Content-Range',result.length);
        res.send(result);
    }); 
});
//Create new user allocation
router.post('/_user_relationship_list',(req,res) => {

    const column = req.body;
    var qryStr = "(";

    for(var head in column){
        if(column[head]!=null){
            if(head==='parent_user'){
                qryStr += ("parent_user_id,");
            }
            else if(head==='child_user'){
                qryStr += ("child_user_id,");
            }
            else if(head==='role_alias'){
                qryStr += ("rel_role,");
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
            if(head==='parent_user'||head==='child_user'||head==='assigned_by'){
                qryStr += ("(SELECT user_id FROM _user WHERE ldap_uname='"+column[head]+"'),");
            }
            else if(head==='role_alias'){
                qryStr += ("(SELECT role_id FROM _role WHERE role_alias='"+column[head]+"'),");
            }
            else{
                qryStr += ("'"+column[head]+"',");
            }
        }
    }
    qryStr = qryStr.slice(0, -1);
    qryStr += (")");

    const sqlQry = "INSERT INTO _user_relationship "+qryStr+";";  
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send(JSON.stringify(sendError(error.errno,error.sqlMessage)));
        }
        res.send(result);
    }); 
 

});
//Get one user allocation
router.get('/_user_relationship_list/:id',(req,res) => {
    // console.log('oo');
});
//Update one user allocation
router.put('/_user_relationship_list/:id',(req,res) => {

    const column = req.body;
    var sqlUpdateRow = "";

    for(var head in column){
        if(head==='parent_user'){
            const sqlPU = "(SELECT user_id FROM _user WHERE ldap_uname='"+column[head]+"'),";
            sqlUpdateRow += ("parent_user_id=("+sqlPU+"),");        
        }
        else if(head==='child_user'){
            const sqlCU = "(SELECT user_id FROM _user WHERE ldap_uname='"+column[head]+"'),";
            sqlUpdateRow += ("child_user_id=("+sqlCU+"),");               
        }
        else if(head==='role_alias'){
            const sqlRole = "(SELECT role_id FROM _role WHERE role_alias='"+column[head]+"'),";
            sqlUpdateRow += ("rel_role=("+sqlRole+"),");               
        }
        else{
            sqlUpdateRow += (head+"='"+column[head]+"',");
        }
    }
    sqlUpdateRow = sqlUpdateRow.slice(0, -1);
    const sqlQry = ("UPDATE _user_relationship SET "+sqlUpdateRow+" WHERE rel_id="+req.params.id+";");
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send(JSON.stringify(sendError(error.errno,error.sqlMessage)));
        }
        res.send(result);
    });
 
});
//Delete user allocation
router.delete('/_user_relationship_list/:id',(req,res) => {

    const sqlQry = "DELETE FROM _user_relationship WHERE rel_id = "+req.params.id+" LIMIT 1;";
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send(JSON.stringify(sendError(error.errno,error.sqlMessage)));
        }
        res.send(result);
    }); 
});


module.exports = router;