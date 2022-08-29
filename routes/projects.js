const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const db = require('../connection.js');
const {printList,sendError} = require('../functions.js');

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


////////////////////////////////////////////Projects Operations////////////////////////////////////////////////
//Get list of projects
router.get('/_project_list',(req,res) => {

    printList(req,res,"_view_project_list");
      
});
//Create new project
router.post('/_project_list',(req,res) => {

    const column = req.body;
    var qryStr = "(";

    for(var head in column){
        if(column[head]!==''){
            if(head==='svr_alias'){
                qryStr += ("svr_id,");
            }
            else if(head==='tech_name'){
                qryStr += ("tech_id,");
            }
            else{
                qryStr += (head+",");
            }
        }
    }
    qryStr = qryStr.slice(0, -1);
    qryStr += (") VALUES (");
    for(var head in column){
        if(column[head]!==''){
            if(head==='status'){
                if(column[head]==='Active'){
                    qryStr += ("1,");
                }
                else{
                    qryStr += ("0,");
                }
            }
            else if(head==='svr_alias'){
                qryStr += ("(SELECT svr_id FROM _server WHERE svr_alias='"+column[head]+"'),");
            }
            else if(head==='tech_name'){
                qryStr += ("(SELECT tech_id FROM _technology WHERE tech_name='"+column[head]+"'),");
            }
            else{
                qryStr += ("'"+column[head]+"',");
            }
        }
    }
    qryStr = qryStr.slice(0, -1);
    qryStr += (")");


    const sqlQry = "INSERT INTO _project "+qryStr+";";  
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send(JSON.stringify(sendError(error.errno,error.sqlMessage)));
        }
        res.send(result);
    }); 

});
//Get one project
router.get('/_project_list/:id',(req,res) => {
    // console.log('oo');
});
//Update one project
router.put('/_project_list/:id',(req,res) => {

    const column = req.body;
    var sqlUpdateRow = "";

    for(var head in column){
        if(head==='svr_alias'){
            const sqlSVR = "SELECT svr_id FROM _server WHERE svr_alias = '"+column[head]+"'";
            sqlUpdateRow += ("svr_id=("+sqlSVR+"),");
        }
        else if(head==='tech_name'){
            const sqlTech = "SELECT tech_id FROM _technology WHERE tech_name = '"+column[head]+"'";
            sqlUpdateRow += ("tech_id=("+sqlTech+"),");
        }
        else if(head==='status'){
            if(column[head]==='Active'){
                sqlUpdateRow += ("status=1,");
            }
            else{
                sqlUpdateRow += ("status=0,");
            }
        }
        else{
            sqlUpdateRow += (head+"='"+column[head]+"',");
        }
    }
    sqlUpdateRow = sqlUpdateRow.slice(0, -1);
    const sqlQry = ("UPDATE _project SET "+sqlUpdateRow+" WHERE pro_id="+req.params.id+";");
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send(JSON.stringify(sendError(error.errno,error.sqlMessage)));
        }
        res.send(result);
    });
 
});
//Delete projects
router.delete('/_project_list/:id',(req,res) => {

    const sqlQry = "DELETE FROM _project WHERE pro_id = "+req.params.id+" LIMIT 1;";
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send(JSON.stringify(sendError(error.errno,error.sqlMessage)));
        }
        res.send(result);
    }); 
});




module.exports = router;