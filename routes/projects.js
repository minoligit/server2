const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const db = require('../connection.js');

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


////////////////////////////////////////////Projects Operations////////////////////////////////////////////////
//Get list of projects
router.get('/_project_list',(req,res) => {

    const column = JSON.parse(req.query.filter);
    var qryStr = "1 ";
    const start = (JSON.parse(req.query.range)[0]);
    const end = (JSON.parse(req.query.range)[1]);
    const sortBy = (JSON.parse(req.query.sort)[0]);
    const order = (JSON.parse(req.query.sort)[1]);

    if(column!=null){
        for(var head in column){
            // if(head==='svr_id'||head==='tech_id'||head==='pro_id'){
            //     qryStr += ("&& _project."+head+"="+column[head]+" ");
            // }
            // else{
                qryStr += ("&& "+head+"='"+column[head]+"' ");
            // }
        }
    }
    const sqlQry = ("SELECT * FROM _view_project_list WHERE ("+qryStr+") ORDER BY "+sortBy+
        " "+order+" LIMIT "+(end-start+1)+" OFFSET "+start+";");
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
        }
        res.header('Content-Range',result.length);
        res.send(result);
    }); 
});
//Create new project
router.post('/_project_list',(req,res) => {

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
            if(head==='status'){
                if(column[head]==='Active'){
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



    const sqlQry = "INSERT INTO _project "+qryStr+";";  
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send('Something went wrong. Please try again.');
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
    const sqlQry = ("UPDATE _project SET "+sqlUpdateRow+" WHERE pro_id="+req.body.id+";");
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send('Something went wrong. Please try again.');
        }
        res.send(result);
    });
 
});
//Delete projects
router.delete('/_project_list/:id',(req,res) => {

    const sqlQry = "DELETE FROM _project WHERE pro_id = "+req.params.id+";";
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
        }
        res.send(result);
    }); 
});



// //Get List of users for a specific project - use get list of users resource with default filter for pro_id
// //Get list of projects for a specific project
// router.get('/_project_user',(req,res) => {

//     const column = JSON.parse(req.query.filter);
//     var qryStr = "1 ";
//     const start = (JSON.parse(req.query.range)[0]);
//     const end = (JSON.parse(req.query.range)[1]);
//     const sortBy = (JSON.parse(req.query.sort)[0]);
//     const order = (JSON.parse(req.query.sort)[1]);

//     if(column!=null){
//         for(var head in column){
//             if(head==='id'){
//                 qryStr += ("&& _project_user.pro_id="+column[head]+" ");
//             }
//             else{
//                 qryStr += ("&& "+head+"='"+column[head]+"' ");
//             }
//         }
//     }

//     const sqlQry = "CALL get_project_user_list(\"("+qryStr+")\",\""+sortBy+"\",\""+order+"\","+start+","+end+");";
//     console.log(sqlQry);
//     db.query(sqlQry, (error, result) => {
//         if(error){
//             console.log(error);
//             res.send('Something went wrong. Please try again.');
//         }
//         res.send(result[0]);
//     }); 

// });
// //Get one record of project user for a specific project
// router.put('/_project_user/:id',(req,res) => {
// });
// //Update one project user of a specific project
// router.put('/_project_user/:id',(req,res) => {

//     const column = req.body;
//     var sqlStr = "";

//     for(var head in column){
//         if(head==='ldap_uname'){
//             const sqlUname = "SELECT user_id FROM _user WHERE ldap_uname = '"+column[head]+"'";
//             sqlStr += ("user_id=("+sqlUname+"),");
//         }
//         else{
//             sqlStr += (head+"='"+column[head]+"',");
//         }
//     }
//     sqlStr = sqlStr.slice(0, -1);
//     const sqlQry = "CALL update_project_user("+req.params.pro_id+","+req.body.user_id+",\""+sqlStr+"\""+");";
//     db.query(sqlQry, (error, result) => {
//         res.header('Content-Range',result.length);
//         res.send(result[0]);
//     }); 
// });


// //Get project target allocation for a specific project
// router.get('/_project_project_target_allocation',(req,res) => {

//     const column = JSON.parse(req.query.filter);
//     var qryStr = "1 ";
//     const start = (JSON.parse(req.query.range)[0]);
//     const end = (JSON.parse(req.query.range)[1]);
//     const sortBy = (JSON.parse(req.query.sort)[0]);
//     const order = (JSON.parse(req.query.sort)[1]);

//     if(column!=null){
//         for(var head in column){
//             if(head==='id'){
//                 qryStr += ("&& _project_target_alloc.pro_id="+column[head]+" ");
//             }
//             else{
//                 qryStr += ("&& "+head+"='"+column[head]+"' ");
//             }
//         }
//     }

//     const sqlQry = "CALL get_project_target_alloc_list(\"("+qryStr+")\",\""+sortBy+"\",\""+order+"\","+start+","+end+");";
//     db.query(sqlQry, (error, result) => {
//         res.header('Content-Range',result.length);
//         res.send(result[0]);
//     }); 
// });
// //Get one record of project target allocation for a specific project 
// router.get('/_project_project_target_allocation/:id',(req,res) => {
// });
// //Update project target allocation one record for specific project
// router.put('/_project_project_target_allocation/:id',(req,res) => {

//     const column = req.body;
//     var sqlStr = "";

//     for(var head in column){
//         if(head==='target_fact'){
//             const sqlTargetId = "SELECT target_id FROM _target WHERE target_fact = '"+column[head]+"'";
//             sqlStr += ("target_id=("+sqlTargetId+"),");
//         }
//         else if(head==='ldap_uname'){
//             const sqlUserId = "SELECT user_id FROM _user WHERE ldap_uname = '"+column[head]+"'";
//             sqlStr += ("allocated_user_id=("+sqlUserId+"),");
//         }
//         else{
//             sqlStr += (head+"='"+column[head]+"',");
//         }
//     }
//     sqlStr = sqlStr.slice(0, -1);
//     const sqlQry = "CALL update_project_target_alloc("+req.params.id+",\""+sqlStr+"\""+");";
//     db.query(sqlQry, (error, result) => {
//         res.header('Content-Range',result.length);
//         res.send(result[0]);
//     }); 
// });


// //Get project daily work for a specific project
// router.get('/_project_daily_work',(req,res) => {

//     const column = JSON.parse(req.query.filter);
//     var qryStr = "1 ";
//     const start = (JSON.parse(req.query.range)[0]);
//     const end = (JSON.parse(req.query.range)[1]);
//     const sortBy = (JSON.parse(req.query.sort)[0]);
//     const order = (JSON.parse(req.query.sort)[1]);

//     if(column!=null){
//         for(var head in column){
//             if(head==='id'){
//                 qryStr += ("&& _project_daily_work.pro_id="+column[head]+" ");
//             }
//             else{
//                 qryStr += ("&& "+head+"='"+column[head]+"' ");
//             }
//         }
//     }

//     const sqlQry = "CALL get_project_daily_work_list(\"("+qryStr+")\",\""+sortBy+"\",\""+order+"\","+start+","+end+");";
//     db.query(sqlQry, (error, result) => {
//         res.header('Content-Range',result.length);
//         res.send(result[0]);
//     }); 
// });
// //Get one record of project daily work for a specific project 
// router.get('/_project_daily_work/:id',(req,res) => {
// });
// //Update project daily work one record for specific project
// router.put('/_project_daily_work/:id',(req,res) => {

//     const column = req.body;
//     var sqlStr = "";

//     for(var head in column){
//         if(head==='ldap_uname'){
//             const sqlUserId = "SELECT user_id FROM _user WHERE ldap_uname = '"+column[head]+"'";
//             sqlStr += ("user_id=("+sqlUserId+"),");
//         }
//         else if(head==='protion'){
//             const sqlProtionId = "SELECT protion_id FROM _project_day_protion WHERE protion = '"+column[head]+"'";
//             sqlStr += ("protion_id=("+sqlProtionId+"),");
//         } 
//         else if(head==='defined_user'){
//             const sqlUserId = "SELECT user_id FROM _user WHERE ldap_uname = '"+column[head]+"'";
//             sqlStr += ("defined_user_id=("+sqlUserId+"),");
//         }   
//         else{
//             sqlStr += (head+"='"+column[head]+"',");
//         }
//     }
//     sqlStr = sqlStr.slice(0, -1);
//     const sqlQry = "CALL update_project_target_alloc("+req.params.id+",\""+sqlStr+"\""+");";
//     db.query(sqlQry, (error, result) => {
//         res.header('Content-Range',result.length);
//         res.send(result[0]);
//     }); 
// });

module.exports = router;