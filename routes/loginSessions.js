const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const db = require('../connection.js');
const {printList,sendError} = require('../functions.js');

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


///////////////////////////////////////////////Login Session Operations///////////////////////////////////////////////
//Get list of all login session
router.get('/_login_session_list',(req,res) => {

    printList(req,res,"_view_login_session_list");
     
});
//Create new login session - not allowed
router.post('/_login_session_list',(req,res) => {

    const column = req.body;
    var qryStr = "(";

    for(var head in column){
        if(column[head]!=null){
            if(head==='ldap_uname'){
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
            if(head==='ldap_uname'){
                qryStr += ("(SELECT user_id FROM _user WHERE ldap_uname='"+column[head]+"'),");
            }
            else if(head==='session_state'){
                if(column[head]==='Active'){
                    qryStr += ("1,");
                }
                else{
                    qryStr += ("0,");
                }
            }
            else{
                qryStr += (column[head]+",");
            }
        }
    }
    qryStr = qryStr.slice(0, -1);
    qryStr += (")");

    const sqlQry = "INSERT INTO _login_session "+qryStr+";";    
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send(JSON.stringify(sendError(error.errno,error.sqlMessage)));
        }
        res.send(result);
    }); 
});
//Get one login session
router.get('/_login_session_list/:id',(req,res) => {
    // console.log('oo');
});
//Update one login session
router.put('/_login_session_list/:id',(req,res) => {

    const column = req.body;
    var sqlUpdateRow = "";

    for(var head in column){
        if(head==='session_state'){
            if(column[head]==='Active'){
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
    const sqlQry = ("UPDATE _login_session SET "+sqlUpdateRow+" WHERE session_id="+req.params.id+";");
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send(JSON.stringify(sendError(error.errno,error.sqlMessage)));
        }
        res.send(result);
    });
 
});
//Delete login session - not allowed
router.delete('/_login_session_list/:id',(req,res) => {

    const sqlQry = "DELETE FROM _login_session WHERE session_id = "+req.params.id+" LIMIT 1;";
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send(JSON.stringify(sendError(error.errno,error.sqlMessage)));
        }
        res.send(result);
    }); 
});



module.exports = router;