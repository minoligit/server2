const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const db = require('../connection.js');
const {isList,isFilter,printList} = require('../functions.js');

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


/////////////////////////////////////////////////User Group Members//////////////////////////////////////////////////////
//Get list of all user group members
router.get('/_config_ugmembers_list',(req,res) => {

    printList(req,res,"_view_config_ugmembers_list");
    
});
//Create new user group members
router.post('/_config_ugmembers_list',(req,res) => {

    const column = req.body;
    var qryStr = "(";

    for(var head in column){
        if(column[head]!=null){
            qryStr += (head+",");
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

    const sqlQry = "INSERT INTO _config_ugmembers "+qryStr+";";  
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send(JSON.stringify(sendError(error.errno,error.sqlMessage)));
        }
        res.send(result);
    }); 
});
//Get one user group members
router.get('/_config_ugmembers_list/:id',(req,res) => {
    // console.log('oo');
});
//Update one user group members
router.put('/_config_ugmembers_list/:id',(req,res) => {

    const column = req.body;
    var sqlUpdateRow = "";

    for(var head in column){
        sqlUpdateRow += (head+"='"+column[head]+"',");
    }
    sqlUpdateRow = sqlUpdateRow.slice(0, -1);

    const qryId = "SELECT UserName,GroupID FROM _veiw_config_ugmembers_list WHERE id="+req.params.id+";";
    db.query(qryId, (error,result) => {
        const sqlQry = ("UPDATE _config_ugmembers SET "+sqlUpdateRow+" WHERE (UserName="+result[0].UserName+
            " && GroupID="+result[0].GroupID+");");        
            db.query(sqlQry, (error, result) => {
            if(error){
                console.log(error);
                res.send(JSON.stringify(sendError(error.errno,error.sqlMessage)));
            }
            res.send(result);
        }); 
    });
 
});
//Delete user group members
router.delete('/_config_ugmembers_list/:id',(req,res) => {

    const qryId = "SELECT UserName,GroupID FROM _veiw_config_ugmembers_list WHERE id="+req.params.id+";";
    db.query(qryId, (error,result) => {
        const sqlQry = "DELETE FROM _config_ugmembers WHERE (UserName="+result[0][0].UserName+" && GroupID="+result[0][0].GroupID+") LIMIT 1;";
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