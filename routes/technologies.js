const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const db = require('../connection.js')

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


//////////////////////////////////////////////Technologies Options///////////////////////////////////////////
//Get list of technologies
router.get('/_technology_list',(req,res) => {

    const column = JSON.parse(req.query.filter);
    var qryStr = "1 ";
    const start = (JSON.parse(req.query.range)[0]);
    const end = (JSON.parse(req.query.range)[1]);
    const sortBy = (JSON.parse(req.query.sort)[0]);
    const order = (JSON.parse(req.query.sort)[1]);

    if(column!=null){
        for(var head in column){
            // if(head==='user_id'){
            //     qryStr += ("&& _project_daily_work.user_id="+column[head]+" ");
            // }
            // else{
                qryStr += ("&& "+head+"='"+column[head]+"' ");
            // }
        }
    }
    const sqlQry = ("SELECT * FROM _view_technology_list WHERE ("+qryStr+") ORDER BY "+sortBy+
        " "+order+" LIMIT "+(end-start+1)+" OFFSET "+start+";");       
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
        }
        res.header('Content-Range',result.length);
        res.send(result);
    }); 
});
//Create new technology
router.post('/_technology_list',(req,res) => {

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

    const sqlQry = "INSERT INTO _technology "+qryStr+";";  
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send('Something went wrong. Please try again.');
        }
        res.send(result);
    }); 
});
//Get one of technology
router.get('/_technology_list/:id',(req,res) => {
    // console.log(req.params.id);
});
//Update one row of technology
router.put('/_technology_list/:id',(req,res) => {

    const column = req.body;
    var sqlUpdateRow = "";

    for(var head in column){
        sqlUpdateRow += (head+"='"+column[head]+"',");
    }
    sqlUpdateRow = sqlUpdateRow.slice(0, -1);

    const sqlQry = ("UPDATE _technology SET "+sqlUpdateRow+" WHERE tech_id="+req.body.id+";");
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send('Something went wrong. Please try again.');
        }
        res.send(result);
    });
});
//Technology multiple update
router.put('/_technology_list',(req,res) => {
    console.log("mmm",req.body);
});
//Delete technology
router.delete('/_technology_list/:id',(req,res) => {

    const sqlQry = "DELETE FROM _technology WHERE tech_id = "+req.params.id+";";
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
        }
        res.send(result);
    });  
});


//Cell editing technology
router.put('/updateCellTech/:id/:column/:value',(req,res) => {

    const sqlStr = "UPDATE _technology SET "+req.params.column+"='"+req.params.value+"' WHERE tech_id="+req.params.id+"";
    db.query(sqlStr, (error, result) => {
        console.log(error);
        res.send(error);
    });
});


// //Get List of projects for a specific technology - use get list of projects resource with default filter for tech_id
// //Get list of projects of a specific technology
// router.get('/_technology_project_list',(req,res) => {

//     const column = JSON.parse(req.query.filter);
//     var qryStr = "1 ";
//     const start = (JSON.parse(req.query.range)[0]);
//     const end = (JSON.parse(req.query.range)[1]);
//     const sortBy = (JSON.parse(req.query.sort)[0]);
//     const order = (JSON.parse(req.query.sort)[1]);

//     if(column!=null){
//         for(var head in column){
//             if(head==='id'){
//                 qryStr += ("&& _project.tech_id="+column[head]+" ");
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
// //Get one project for specific technology
// router.get('/_technology_project_list/:id',(req,res) => {
//     // console.log('oo');
// });
// //Update one project for specific technology
// router.put('/_technology_project_list/:id',(req,res) => {

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