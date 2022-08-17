const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const db = require('../connection.js')

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


///////////////////////////////////////////////////Servers Operations///////////////////////////////////////////
//Get list of servers
router.get('/_server_list',(req,res) => {

    const column = JSON.parse(req.query.filter);
    var qryStr = "1 ";
    const start = (JSON.parse(req.query.range)[0]);
    const end = (JSON.parse(req.query.range)[1]);
    const sortBy = (JSON.parse(req.query.sort)[0]);
    const order = (JSON.parse(req.query.sort)[1]);

    if(column!=null){
        for(var head in column){
            // if(head==='pro_id'){
            //     qryStr += ("&& _server.pro_id="+column[head]+" ");
            // }
            // else{
                qryStr += ("&& "+head+"='"+column[head]+"' ");
            // }
        }
    }
    const sqlQry = ("SELECT * FROM _view_server_list WHERE ("+qryStr+") ORDER BY "+sortBy+
        " "+order+" LIMIT "+(end-start+1)+" OFFSET "+start+";");    
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
        }
        res.header('Content-Range',result.length);
        res.send(result);
    }); 
});
//Create new server
router.post('/_server_list',(req,res) => {

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

    const sqlQry = "INSERT INTO _server "+qryStr+";";  
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send('Something went wrong. Please try again.');
        }
        res.send(result);
    }); 

});
//Get one server
router.get('/_server_list/:id',(req,res) => {
});
//Update server one row
router.put('/_server_list/:id',(req,res) => {

    const column = req.body;
    var sqlUpdateRow = "";

    for(var head in column){
        sqlUpdateRow += (head+"='"+column[head]+"',");
    }
    sqlUpdateRow = sqlUpdateRow.slice(0, -1);

    const sqlQry = ("UPDATE _server SET "+sqlUpdateRow+" WHERE svr_id="+req.body.id+";");
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send('Something went wrong. Please try again.');
        }
        res.send(result);
    });  
});
//Delete servers
router.delete('/_server_list/:id',(req,res) => {

    const sqlQry = "DELETE FROM _server WHERE svr_id = "+req.params.id+";";
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
        }
        res.send(result);
    }); 
});

//Cell editing server
router.put('/updateCellServer/:id/:column/:value',(req,res) => {

    const sqlStr = "UPDATE _server SET "+req.params.column+"='"+req.params.value+"' WHERE svr_id="+req.params.id+"";
    db.query(sqlStr, (error, result) => {
        console.log(error);
        res.send(error);
    });
});




// //Get List of projects for a specific server - use get list of projects resource with default filter for svr
// //Get list of projects for a specific server
// router.get('/_server_project_list',(req,res) => {

//     const column = JSON.parse(req.query.filter);
//     var qryStr = "1 ";
//     const start = (JSON.parse(req.query.range)[0]);
//     const end = (JSON.parse(req.query.range)[1]);
//     const sortBy = (JSON.parse(req.query.sort)[0]);
//     const order = (JSON.parse(req.query.sort)[1]);

//     if(column!=null){
//         for(var head in column){
//             if(head==='id'){
//                 qryStr += ("&& _project.svr_id="+column[head]+" ");
//             }
//             else{
//                 qryStr += ("&& "+head+"='"+column[head]+"' ");
//             }
//         }
//     }

//     const sqlQry = "CALL get_project_list(\"("+qryStr+")\",\""+sortBy+"\",\""+order+"\","+start+","+end+");";
//     db.query(sqlQry, (error, result) => {
//         res.header('Content-Range',result.length);
//         res.send(result[0]);
//     }); 
// });
// //Get one project of a specific server
// router.get('/_server_project_list/:id',(req,res) => {
//     // console.log('oo');
// });
// //Update one project of a specific server
// router.put('/_server_project_list/:id',(req,res) => {

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

module.exports = router;