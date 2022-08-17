const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const db = require('../connection.js');

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

////////////////////////////////////////////Users Operations////////////////////////////////////////////////
//Get list of users
// router.get('/_user_list',(req,res) => {

//     const column = JSON.parse(req.query.filter);
//     var qryStr = "1 ";
//     const start = (JSON.parse(req.query.range)[0]);
//     const end = (JSON.parse(req.query.range)[1]);
//     const sortBy = (JSON.parse(req.query.sort)[0]);
//     const order = (JSON.parse(req.query.sort)[1]);

//     if(column!=null){
//         for(var head in column){
//             if(head==='role_id'||head==='user_id'){
//                 qryStr += ("&& _user."+head+"="+column[head]+" ");
//             }
//             else{
//                 qryStr += ("&& "+head+"='"+column[head]+"' ");
//             }
//         }
//     }
//     const sqlQry = "CALL get_user_list(\"("+qryStr+")\",\""+sortBy+"\",\""+order+"\","+start+","+end+");";
//     db.query(sqlQry, (error, result) => {
//         console.log(error);
//         res.header('Content-Range',result.length);
//         res.send(result[0]);
//     }); 
// });
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
    console.log(sqlQry);
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send('Something went wrong. Please try again.');
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
            sqlUpdateRow += ("role_id="+column[head]+",");
        }
        else if(head==='state'){
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
    const sqlQry = ("UPDATE _user SET "+sqlUpdateRow+" WHERE user_id="+req.body.id+";");
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send('Something went wrong. Please try again.');
        }
        res.send(result);
    });
 
});
//Delete users
router.delete('/_user_list/:id',(req,res) => {

    const sqlQry = "DELETE FROM _user WHERE user_id = "+req.params.id+";";
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
        }
        res.send(result);
    }); 
});


// //Get all projects of the user
// router.get('/_user_project_list/:id',(req,res) => {

//     const column = JSON.parse(req.query.filter);
//     var qryStr = ("project_user.user_id="+req.params.id);
//     const start = (JSON.parse(req.query.range)[0]);
//     const end = (JSON.parse(req.query.range)[1]);
//     const sortBy = (JSON.parse(req.query.sort)[0]);
//     const order = (JSON.parse(req.query.sort)[1]);

//     if(column!=null){
//         for(var head in column){
//             qryStr += ("&& "+head+"='"+column[head]+"' ");
//         }
//     }
//     const sqlQry = "CALL get_project_user_list(\"("+qryStr+")\",\""+sortBy+"\",\""+order+"\","+start+","+end+");";
//     // const sqlQry = "CALL test_run('"+qryStr+"')";
//     db.query(sqlQry, (error, result) => {
//         if(error){
//             console.log(error);
//             res.send('Something went wrong. Please try again.');
//         }
//         res.send(result[0]);
//     }); 

// });

router.get('/_user_list',(req,res) => {

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
    const sqlQry = ("SELECT * FROM _view_user_list WHERE ("+qryStr+") ORDER BY "+sortBy+
        " "+order+" LIMIT "+(end-start+1)+" OFFSET "+start+";");
    db.query(sqlQry, (error, result) => {
        console.log(error);
        res.header('Content-Range',result.length);
        res.send(result);
    }); 
});


module.exports = router;