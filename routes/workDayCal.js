const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const db = require('../connection.js');

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


/////////////////////////////////////////////////Work Day Calendar//////////////////////////////////////////////////////
//Get list of all work day calendar
router.get('/_work_day_calendar_list',(req,res) => {

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
    const sqlQry = ("SELECT * FROM _view_work_day_calendar_list WHERE ("+qryStr+") ORDER BY "+sortBy+
        " "+order+" LIMIT "+(end-start+1)+" OFFSET "+start+";");
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
        }
        res.header('Content-Range',result.length);
        res.send(result);
    }); 
});
//Create new work day calendar
router.post('/_work_day_calendar_list',(req,res) => {

    const column = req.body;
    var qryStr = "(";

    for(var head in column){
        if(column[head]!=null){
            if(head==='defined_ldap_uname'){
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
            if(head==='defined_ldap_uname'){
                qryStr += ("(SELECT user_id FROM _user WHERE ldap_uname='"+column[head]+"'),");
            }
            else{
                qryStr += ("'"+column[head]+"',");
            }
        }
    }
    qryStr = qryStr.slice(0, -1);
    qryStr += (")");

    const sqlQry = "INSERT INTO _work_day_calendar "+qryStr+";";  
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send('Something went wrong. Please try again.');
        }
        res.send(result);
    }); 
});
//Get one work day calendar
router.get('/_work_day_calendar_list/:id',(req,res) => {
    // console.log('oo');
});
//Update one work day calendar
router.put('/_work_day_calendar_list/:id',(req,res) => {

    const column = req.body;
    var sqlUpdateRow = "";

    for(var head in column){
        if(head==='defined_ldap_uname'){
            qryStr += ("defined_user_id=(SELECT user_id FROM _user WHERE ldap_uname='"+column[head]+"'),");
        }
        else{
            sqlUpdateRow += (head+"='"+column[head]+"',");
        }
    }
    sqlUpdateRow = sqlUpdateRow.slice(0, -1);
    const sqlQry = ("UPDATE _work_day_calendar SET "+sqlUpdateRow+" WHERE cal_id="+req.body.id+";");
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send('Something went wrong. Please try again.');
        }
        res.send(result);
    });
 
});
//Delete project work day calendar
router.delete('/_work_day_calendar_list/:id',(req,res) => {

    const sqlQry = "DELETE FROM _work_day_calendar WHERE cal_id = "+req.params.id+";";
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
        }
        res.send(result);
    }); 
});



module.exports = router;