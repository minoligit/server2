const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const db = require('../connection.js');

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


///////////////////////////////////////////////////Roles Operations//////////////////////////////////////////////
//Get List of Roles
// router.get('/_role_list',(req,res) => {

//     const column = JSON.parse(req.query.filter);
//     var qryStr = "1 ";
//     const start = (JSON.parse(req.query.range)[0]);
//     const end = (JSON.parse(req.query.range)[1]);
//     const sortBy = (JSON.parse(req.query.sort)[0]);
//     const order = (JSON.parse(req.query.sort)[1]);

//     if(column!=null){
//         for(var head in column){
//             qryStr += ("&& "+head+"='"+column[head]+"' ");
//         }
//     }
//     const sqlSelectAll = "CALL get_role_list(\"("+qryStr+")\",\""+sortBy+"\",\""+order+"\","+start+","+end+");";
//     db.query(sqlSelectAll, (error, result) => {
//         if(error){
//             console.log(error);
//         }
//         res.header('Content-Range',result.length);
//         res.send(result[0]);
//     }); 
// });
//Create new roles
router.post('/_role_list',(req,res) => {

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

    const sqlQry = "INSERT INTO _role "+qryStr+";";  
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send('Something went wrong. Please try again.');
        }
        res.send(result);
    }); 
});
//Get one role
router.get('/_role_list/:id',(req,res) => {
    // console.log(req.params.id);
});
//Update role one row
router.put('/_role_list/:id',(req,res) => {

    const column = req.body;
    var sqlUpdateRow = "";

    for(var head in column){
        sqlUpdateRow += (head+"='"+column[head]+"',");
    }
    sqlUpdateRow = sqlUpdateRow.slice(0, -1);

    console.log(sqlUpdateRow);
    const sqlQry = ("UPDATE _role SET "+sqlUpdateRow+" WHERE role_id="+req.body.id+";");
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send('Something went wrong. Please try again.');
        }
        res.send(result);
    });
});
//Update many role
router.put('/_role_list',(req,res) => {
    console.log("mmm",req.body);
});
//Delete roles
router.delete('/_role_list/:id',(req,res) => {

    const sqlQry = "DELETE FROM _role WHERE role_id = "+req.params.id+";";
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
        }
        res.send(result);
    }); 
});

//Cell editing roles
router.put('/updateCellRole/:id/:column/:value',(req,res) => {

    const sqlStr = "UPDATE _role SET "+req.params.column+"='"+req.params.value+"' WHERE role_id="+req.params.id+"";
    db.query(sqlStr, (error, result) => {
        res.send(error);
    });
});



// //Get List of role directory mount option for a specific role
// router.get('/_role_role_dir_mount_option',(req,res) => {

//     const column = JSON.parse(req.query.filter);
//     var qryStr = "1 ";
//     const start = (JSON.parse(req.query.range)[0]);
//     const end = (JSON.parse(req.query.range)[1]);
//     const sortBy = (JSON.parse(req.query.sort)[0]);
//     const order = (JSON.parse(req.query.sort)[1]);

//     if(column!=null){
//         for(var head in column){
//             if(head==='id'){
//                 qryStr += ("&& _role_directory_mount_opt.role_id="+column[head]+" ");
//             }
//             else{
//                 qryStr += ("&& "+head+"='"+column[head]+"' ");
//             }
//         }
//     }

//     const sqlSelectAll = "CALL get_role_dir_mount_opt_list(\"("+qryStr+")\",\""+sortBy+"\",\""+order+"\","+start+","+end+");";
//     db.query(sqlSelectAll, (error, result) => {
//         console.log(sqlSelectAll);
//         res.header('Content-Range',result.length);
//         res.send(result[0]);
//     }); 
// });


// //Get List of user realtionship for a specific role
// router.get('/_role_user_relationship',(req,res) => {

//     const column = JSON.parse(req.query.filter);
//     var qryStr = "1 ";
//     const start = (JSON.parse(req.query.range)[0]);
//     const end = (JSON.parse(req.query.range)[1]);
//     const sortBy = (JSON.parse(req.query.sort)[0]);
//     const order = (JSON.parse(req.query.sort)[1]);

//     if(column!=null){
//         for(var head in column){
//             if(head==='id'){
//                 qryStr += ("&& _user_relationship.rel_role="+column[head]+" ");
//             }
//             else{
//                 qryStr += ("&& "+head+"='"+column[head]+"' ");
//             }
//         }
//     }

//     const sqlSelectAll = "CALL get_user_relationship_list(\"("+qryStr+")\",\""+sortBy+"\",\""+order+"\","+start+","+end+");";
//     db.query(sqlSelectAll, (error, result) => {
//         res.header('Content-Range',result.length);
//         res.send(result[0]);
//     }); 
// });


router.get('/_role_list',(req,res) => {

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
    const sqlQry = ("SELECT * FROM _view_role_list WHERE ("+qryStr+") ORDER BY "+sortBy+
        " "+order+" LIMIT "+(end-start+1)+" OFFSET "+start+";");
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
        }
        res.header('Content-Range',result.length);
        res.send(result);
    }); 
});



module.exports = router;
