const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const db = require('../connection.js');
const {isList,isFilter, printList} = require('../functions.js');

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


////////////////////////////////////////////////Users Operations///////////////////////////////////////////////////
//Get list of users
router.get('/_user_list',(req,res) => {

    printList(req,res,"_view_user_list");
    
});
//Create new user
router.post('/_user_list',(req,res) => {

    const column = req.body;
    var qryStr = "(";

    for(var head in column){
        if(column[head]!=null){
            if(head==='role_alias'){
                qryStr += ("role_id,");
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
            if(head==='state'){
                if(column[head]==='Active'){
                    qryStr += ("1,");
                }
                else{
                    qryStr += ("0,");
                }
            }
            else if(head==='role_alias'){
                qryStr += ("(SELECT role_id FROM _role WHERE role_alias='"+column[head]+"'),");
            }
            else if(head==='passwd'){
                qryStr += ("md5('"+column[head]+"'),");
            }
            else{
                qryStr += ("'"+column[head]+"',");
            }
        }
    }
    qryStr = qryStr.slice(0, -1);
    qryStr += (")");

    const sqlQry = "INSERT INTO _user "+qryStr+";";  
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send(JSON.stringify(sendError(error.errno,error.sqlMessage)));
        }
        res.send(result);
    }); 
});
//Get one user
router.get('/_user_list/:id',(req,res) => {
    // console.log('oo');
});
//Update one user
router.put('/_user_list/:id',(req,res) => {

    const column = req.body;
    var sqlUpdateRow = "";

    for(var head in column){
        if(head==='role_alias'){
            sqlUpdateRow += ("role_id=(SELECT role_id FROM _role WHERE role_alias='"+column[head]+"'),");
        }
        else if(head==='state'){
            if(column[head]==='Active'){
                sqlUpdateRow += (head+"=1,");
            }
            else{
                sqlUpdateRow += (head+"=0,");
            }
        }
        else if(head==='passwd'){
            sqlUpdateRow += (head+"=md5('"+column[head]+"'),");
        }
        else{
            sqlUpdateRow += (head+"='"+column[head]+"',");
        }
    }
    sqlUpdateRow = sqlUpdateRow.slice(0, -1);
    const sqlQry = ("UPDATE _user SET "+sqlUpdateRow+" WHERE user_id="+req.params.id+";");
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send(JSON.stringify(sendError(error.errno,error.sqlMessage)));
        }
        res.send(result);
    });
 
});
//Delete users
router.delete('/_user_list/:id',(req,res) => {

    const sqlQry = "DELETE FROM _user WHERE user_id = "+req.params.id+" LIMIT 1;";
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send(JSON.stringify(sendError(error.errno,error.sqlMessage)));
        }
        res.send(result);
    }); 
});



//Update multiple users
router.put('/_user_list',(req,res) => {
    console.log("no");
});




module.exports = router;