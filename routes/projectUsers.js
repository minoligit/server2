const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const db = require('../connection.js')

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

/////////////////////////////////////////Project Users////////////////////////////////////////////////////
//Get list of users for all projects
router.get('/_project_user_list',(req,res) => {
    const column = JSON.parse(req.query.filter);
    var qryStr = "1 ";
    const start = (JSON.parse(req.query.range)[0]);
    const end = (JSON.parse(req.query.range)[1]);
    const sortBy = (JSON.parse(req.query.sort)[0]);
    const order = (JSON.parse(req.query.sort)[1]);

    if(column!=null){
        for(var head in column){
            if(head==='pro_id'||head==='user_id'){
                qryStr += ("&& _project_user."+head+"="+column[head]+" ");
            }
            else{
                qryStr += ("&& "+head+"='"+column[head]+"' ");
            }
        }
    }

    const sqlQry = "CALL get_project_user_list(\"("+qryStr+")\",\""+sortBy+"\",\""+order+"\","+start+","+end+");";
    console.log(sqlQry);
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send('Something went wrong. Please try again.');
        }
        res.send(result[0]);
    }); 

});
//Create new project user
router.post('/_project_user_list',(req,res) => {

    const column = req.body;
    var qryStr = "(";

    for(var head in column){
        if(column[head]!=null){
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
        if(head!=null){
            qryStr += ("'"+column[head]+"',");
        }
    }
    qryStr = qryStr.slice(0, -1);
    qryStr += (")");

    const sqlQry = "INSERT INTO _project_user "+qryStr+";";     
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send('Something went wrong. Please try again.');
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
    var sqlUpdateRow = "";

    for(var head in column){
        if(head==='pro_name'){
            const sqlProName = "SELECT pro_id FROM _project WHERE pro_name = '"+column[head]+"'";
            sqlUpdateRow += ("pro_id=("+sqlProName+"),");
        }
        else if(head==='ldap_uame'){
            const sqlUname = "SELECT user_id FROM _user WHERE ldap_uname = '"+column[head]+"'";
            sqlUpdateRow += ("user_id=("+sqlUname+"),");
        }
        else{
            sqlUpdateRow += (head+"='"+column[head]+"',");
        }
    }
    sqlUpdateRow = sqlUpdateRow.slice(0, -1);
    const sqlQry = "CALL update_project_user("+req.body.pro_id+","+req.body.user_id+",\""+sqlUpdateRow+"\");";
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send('Something went wrong. Please try again.');
        }
        res.send(result);
    });
 
});
//Delete project user
router.delete('/_project_user_list/:id',(req,res) => {

    const sqlQry = "CALL delete_project_user("+req.params.id+");";
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send('Something went wrong. Please try again.');
        }
        res.send(result);
    }); 
 
});




// router.get('/_project_user_list/:id',(req,res) => {

//     const sqlQry = "CALL get_project_users("+req.params.id+");";
//     db.query(sqlQry, (error, result) => {
//         res.header('Content-Range',result.length);
//         res.send(result[0]);
//     }); 
// });
router.get('/_test',(req,res) => {

    const sqlQry = "SELECT (pro_id) FROM _project_user;";
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send('Something went wrong. Please try again.');
        }
        res.send(result);
    }); 

});


module.exports = router;