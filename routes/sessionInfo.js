const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const db = require('../connection.js');

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


///////////////////////////////////////////////Session Info Operations///////////////////////////////////////////////
//Get list of all session info
router.get('/_session_info_list',(req,res) => {

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
    const sqlQry = ("SELECT * FROM _view_session_info_list WHERE ("+qryStr+") ORDER BY "+sortBy+
        " "+order+" LIMIT "+(end-start+1)+" OFFSET "+start+";");
    db.query(sqlQry, (error, result) => {
        res.header('Content-Range',result.length);
        res.send(result);
    }); 
});
//Get one session info
router.get('/_session_info_list/:id',(req,res) => {
    // console.log('oo');
});



// //Get Project of session info row
// router.get('/_session_info_project/:id',(req,res) => {

//     const column = JSON.parse(req.query.filter);
//     var qryStr = ("pro_id="+req.params.id+" ");
//     const start = (JSON.parse(req.query.range)[0]);
//     const end = (JSON.parse(req.query.range)[1]);
//     const sortBy = (JSON.parse(req.query.sort)[0]);
//     const order = (JSON.parse(req.query.sort)[1]);

//     if(column!=null){
//         for(var head in column){
//             qryStr += ("&& "+head+"='"+column[head]+"' ");
//         }
//     }
//     const sqlQry = "CALL get_project_list(\"("+qryStr+")\",\""+sortBy+"\",\""+order+"\","+start+","+end+");";
//     db.query(sqlQry, (error, result) => {
//         if(error){
//             console.log(error);
//         }
//         res.header('Content-Range',result.length);
//         res.send(result[0]);
//     }); 
// });
// //Update project of session info row
// router.put('/_session_info_project/:id',(req,res) => {

//     const column = req.body;
//     var sqlUpdateRow = "";

//     for(var head in column){
//         if(head==='svr_alias'){
//             const sqlSVR = "SELECT svr_id FROM _server WHERE svr_alias = '"+column[head]+"'";
//             sqlUpdateRow += ("svr_id=("+sqlSVR+"),");
//         }
//         else if(head==='tech_name'){
//             const sqlTech = "SELECT tech_id FROM _technology WHERE tech_name = '"+column[head]+"'";
//             sqlUpdateRow += ("tech_id=("+sqlTech+"),");
//         }
//         else if(head==='status'){
//             if(column[head]==='Active'){
//                 sqlUpdateRow += ("status=1,");
//             }
//             else{
//                 sqlUpdateRow += ("status=0,");
//             }
//         }
//         else{
//             sqlUpdateRow += (head+"='"+column[head]+"',");
//         }
//     }
//     sqlUpdateRow = sqlUpdateRow.slice(0, -1);
//     const sqlQry = "CALL update_project("+req.params.id+",\""+sqlUpdateRow+"\");";
//     db.query(sqlQry, (error, result) => {
//         if(error){
//             console.log(error);
//             res.send('Something went wrong. Please try again.');
//         }
//     }); 
 
// });
// //Get user of session info row
// router.get('/_session_info_user/:id',(req,res) => {

//     const column = JSON.parse(req.query.filter);
//     var qryStr = ("user_id="+req.params.id+" ");
//     const start = (JSON.parse(req.query.range)[0]);
//     const end = (JSON.parse(req.query.range)[1]);
//     const sortBy = (JSON.parse(req.query.sort)[0]);
//     const order = (JSON.parse(req.query.sort)[1]);

//     if(column!=null){
//         for(var head in column){
//             qryStr += ("&& "+head+"='"+column[head]+"' ");
//         }
//     }
//     const sqlQry = "CALL get_user_list(\"("+qryStr+")\",\""+sortBy+"\",\""+order+"\","+start+","+end+");";
//     db.query(sqlQry, (error, result) => {
//         res.header('Content-Range',result.length);
//         res.send(result[0]);
//     }); 
// });
// //Update user of session info row
// router.put('/_session_info_user/:id',(req,res) => {

//     const column = req.body;
//     var sqlUpdateRow = "";

//     for(var head in column){
//         if(head==='role_alias'){
//             const sqlRole = "SELECT role_id FROM _role WHERE role_alias = '"+column[head]+"'";
//             sqlUpdateRow += ("role_id=("+sqlRole+"),");
//         }
//         else{
//             sqlUpdateRow += (head+"='"+column[head]+"',");
//         }
//     }
//     sqlUpdateRow = sqlUpdateRow.slice(0, -1);
//     const sqlQry = "CALL update_user("+req.params.id+",\""+sqlUpdateRow+"\");";
//     db.query(sqlQry, (error, result) => {
//         if(error){
//             console.log(error);
//             res.send('Something went wrong. Please try again.');
//         }
//     }); 
 
// });

module.exports = router;