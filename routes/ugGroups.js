const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const db = require('../connection.js');

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


/////////////////////////////////////////////////User Groups Operations//////////////////////////////////////////////////////
//Get list of all user group groups
router.get('/_config_uggroups_list',(req,res) => {

    const column = JSON.parse(req.query.filter);
    var qryStr = "1 ";
    const start = (JSON.parse(req.query.range)[0]);
    const end = (JSON.parse(req.query.range)[1]);
    const sortBy = (JSON.parse(req.query.sort)[0]);
    const order = (JSON.parse(req.query.sort)[1]);

    if(column!=null){
        for(var head in column){
            qryStr += ("&& "+head+"='"+column[head]+"' ");
        }
    }
    const sqlQry = "CALL get_config_uggroups_list(\"("+qryStr+")\",\""+sortBy+"\",\""+order+"\","+start+","+end+");";
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
        }
        res.header('Content-Range',result.length);
        res.send(result[0]);
    }); 
});
//Create new user group groups
router.post('/_config_uggroups_list',(req,res) => {

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

    const sqlQry = "INSERT INTO _config_uggroups "+qryStr+";";  
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send('Something went wrong. Please try again.');
        }
        res.send(result);
    }); 
});
//Get one user group groups
router.get('/_config_uggroups_list/:id',(req,res) => {
    // console.log('oo');
});
//Update one user group groups
router.put('/_config_uggroups_list/:id',(req,res) => {

    const column = req.body;
    var sqlUpdateRow = "";

    for(var head in column){
        sqlUpdateRow += (head+"='"+column[head]+"',");
    }
    sqlUpdateRow = sqlUpdateRow.slice(0, -1);
    const sqlQry = "CALL update_config_uggroups("+req.params.id+",\""+sqlUpdateRow+"\");";
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send('Something went wrong. Please try again.');
        }
    }); 
 
});
//Delete project user group groups
router.delete('/_config_uggroups_list/:id',(req,res) => {

    const sqlQry = "DELETE FROM _config_uggroups WHERE GroupID = "+req.params.id+";";
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
        }
        res.send(result);
    }); 
});



module.exports = router;