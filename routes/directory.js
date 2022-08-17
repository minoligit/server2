const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const db = require('../connection.js');

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


//////////////////////////////////////////////Directory Operations///////////////////////////////////////////////////
//Get list of all directory
router.get('/_directory_list',(req,res) => {

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
    const sqlQry = ("SELECT * FROM _view_directory_list WHERE ("+qryStr+") ORDER BY "+sortBy+
        " "+order+" LIMIT "+(end-start+1)+" OFFSET "+start+";");
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
        }
        res.header('Content-Range',result.length);
        res.send(result);
    }); 
});
//Create new directory
router.post('/_directory_list',(req,res) => {

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
            if(head==='is_active'||head==='is_proj_related'||head==='is_proj_uniq'||head==='is_editable'||head==='is_root_dir'){
                if(column[head]==='Yes'){
                    qryStr += ("1,");
                }
                else{
                    qryStr += ("0,");
                }
            }
            else{
                qryStr += ("'"+column[head]+"',");
            }
        }
    }
    qryStr = qryStr.slice(0, -1);
    qryStr += (")");

    const sqlQry = "INSERT INTO _directory "+qryStr+";";   
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send('Something went wrong. Please try again.');
        }
        res.send(result);
    }); 
});
//Get one directory
router.get('/_directory_list/:id',(req,res) => {
    // console.log('oo');
});
//Update one directory
router.put('/_directory_list/:id',(req,res) => {

    const column = req.body;
    var sqlUpdateRow = "";

    for(var head in column){
        if(head==='is_active'||head==='is_proj_related'||head==='is_proj_uniq'||head==='is_editable'||head==='is_root_dir'){
            if(column[head]==='Yes'){
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
    const sqlQry = ("UPDATE _directory SET "+sqlUpdateRow+" WHERE dir_id="+req.body.id+";");
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send('Something went wrong. Please try again.');
        }
        res.send(result);
    });
 
});
//Delete project directory
router.delete('/_directory_list/:id',(req,res) => {

    const sqlQry = "DELETE FROM _directory WHERE dir_id = "+req.params.id+";";
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
        }
        res.send(result);
    }); 
});



module.exports = router;