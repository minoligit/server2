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
//Get list of all project daily work
router.get('/_project_daily_work_list',(req,res) => {

    printList(req,res,"_view_project_daily_work_list");
     
});
//Create new project daily work
router.post('/_project_daily_work_list',(req,res) => {

    const column = req.body;
    var qryStr = "(";

    for(var head in column){
        if(column[head]!=null){
            if(head==='ldap_uname'){
                qryStr += ("user_id,");
            }
            else if(head==='pro_name'){
                qryStr += ("pro_id,");
            }
            else if(head==='portion'){
                qryStr += ("portion_id,");
            }
            else if(head==='defined_user'){
                qryStr += ("defined_user_id,");
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
            else if(head==='pro_name'){
                qryStr += ("(SELECT pro_id FROM _project WHERE pro_name='"+column[head]+"'),");
            }
            else if(head==='portion'){
                qryStr += ("(SELECT portion_id FROM _project_day_protion WHERE portion='"+column[head]+"'),");
            }
            else if(head==='defined_user'){
                qryStr += ("(SELECT user_id FROM _user WHERE ldap_uname='"+column[head]+"'),");
            }
            else{
                qryStr += ("'"+column[head]+"',");
            }
        }
    }
    qryStr = qryStr.slice(0, -1);
    qryStr += (")");

    const sqlQry = "INSERT INTO _project_daily_work "+qryStr+";";  
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send(JSON.stringify(sendError(error.errno,error.sqlMessage)));
        }
        res.send(result);
    }); 
});
//Get one project daily work
router.get('/_project_daily_work_list/:id',(req,res) => {
    // console.log('oo');
});
//Update one project daily work
router.put('/_project_daily_work_list/:id',(req,res) => {

    const column = req.body;
    var sqlUpdateRow = "";

    for(var head in column){
        if(head==='ldap_uname'){
            const sqlUname = "SELECT user_id FROM _user WHERE ldap_uname = '"+column[head]+"'";
            sqlUpdateRow += ("user_id=("+sqlUname+"),");
        }
        else if(head==='pro_name'){
            const sqlProName = "SELECT pro_id FROM _project WHERE pro_name = '"+column[head]+"'";
            sqlUpdateRow += ("pro_id=("+sqlProName+"),");
        }
        else if(head==='portion'){
            sqlUpdateRow += ("portion_id=(SELECT portion_id FROM _project_day_protion WHERE portion='"+column[head]+"'),");
        }
        else if(head==='defined_user'){
            sqlUpdateRow += ("defined_user_id=(SELECT user_id FROM _user WHERE ldap_uname='"+column[head]+"'),");
        }
        else{
            sqlUpdateRow += (head+"='"+column[head]+"',");
        }
    }
    sqlUpdateRow = sqlUpdateRow.slice(0, -1);
    const sqlQry = ("UPDATE _project_daily_work SET "+sqlUpdateRow+" WHERE work_id="+req.params.id+";");
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send(JSON.stringify(sendError(error.errno,error.sqlMessage)));
        }
        res.send(result);
    });
 
});
//Delete project daily work
router.delete('/_project_daily_work_list/:id',(req,res) => {

    const sqlQry = "DELETE FROM _project_daily_work WHERE work_id = "+req.params.id+" LIMIT 1;";
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send(JSON.stringify(sendError(error.errno,error.sqlMessage)));
        }
        res.send(result);
    }); 
});





module.exports = router;