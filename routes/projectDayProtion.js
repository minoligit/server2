const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const db = require('../connection.js');

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

///////////////////////////////////////////////Project Day Protion///////////////////////////////////////////////
//Get list of all projects day protion
router.get('/_project_day_protion_list',(req,res) => {

    const column = JSON.parse(req.query.filter);
    var qryStr = "1 ";
    const start = (JSON.parse(req.query.range)[0]);
    const end = (JSON.parse(req.query.range)[1]);
    const sortBy = (JSON.parse(req.query.sort)[0]);
    const order = (JSON.parse(req.query.sort)[1]);

    if(column!=null){
        for(var head in column){
            // if(head==='portion_id'){
            //     qryStr += ("&& _project_day_protion."+head+"="+column[head]+" ");
            // }
            // else{
                qryStr += ("&& "+head+"='"+column[head]+"' ");
            // }
        }
    }
    const sqlQry = ("SELECT * FROM _view_project_day_protion_list WHERE ("+qryStr+") ORDER BY "+sortBy+
        " "+order+" LIMIT "+(end-start+1)+" OFFSET "+start+";");
    db.query(sqlQry, (error, result) => {
        res.header('Content-Range',result.length);
        res.send(result[0]);
    }); 
});
//Create new project day protion
router.post('/_project_day_protion_list',(req,res) => {

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

    const sqlQry = "INSERT INTO _project_day_protion "+qryStr+";";   
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send('Something went wrong. Please try again.');
        }
        res.send(result);
    }); 
});
//Get one project day protion
router.get('/_project_day_protion_list/:id',(req,res) => {
    // console.log('oo');
});
//Update one project day protion
router.put('/_project_day_protion_list/:id',(req,res) => {

    const column = req.body;
    var sqlUpdateRow = "";

    for(var head in column){
        sqlUpdateRow += (head+"='"+column[head]+"',");
    }
    sqlUpdateRow = sqlUpdateRow.slice(0, -1);
    const sqlQry = ("UPDATE _project_day_protion SET "+sqlUpdateRow+" WHERE portion_id="+req.body.id+";");
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send('Something went wrong. Please try again.');
        }
        res.send(result);
    });
 
});
//Delete project day protion
router.delete('/_project_day_protion_list/:id',(req,res) => {

    const sqlQry = "DELETE FROM _project_day_protion WHERE protion_id = "+req.params.id+";";
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
        }
        res.send(result);
    }); 
});


// //Get list of project daily work for a specific projects day protion
// router.get('/_project_day_protion_daily_work',(req,res) => {

//     const column = JSON.parse(req.query.filter);
//     var qryStr = "1 ";
//     const start = (JSON.parse(req.query.range)[0]);
//     const end = (JSON.parse(req.query.range)[1]);
//     const sortBy = (JSON.parse(req.query.sort)[0]);
//     const order = (JSON.parse(req.query.sort)[1]);

//     if(column!=null){
//         for(var head in column){
//             if(head==='id'){
//                 qryStr += ("&& _project_daily_work.portion_id="+column[head]+" ");
//             }
//             else{
//                 qryStr += ("&& "+head+"='"+column[head]+"' ");
//             }
//         }
//     }

//     const sqlQry = "CALL get_project_day_protion_list(\"("+qryStr+")\",\""+sortBy+"\",\""+order+"\","+start+","+end+");";
//     db.query(sqlQry, (error, result) => {
//         res.header('Content-Range',result.length);
//         res.send(result[0]);
//     }); 
// });
// //Create new project daily work for a specific projects day protion
// router.post('/_project_day_protion_daily_work',(req,res) => {

//     const column = req.body;
//     var qryStr = "(";

//     for(var head in column){
//         if(column[head]!=null){
//             qryStr += (head+",");
//         }
//     }
//     qryStr = qryStr.slice(0, -1);
//     qryStr += (") VALUES (");
//     for(var head in column){
//         if(head!=null){
//             qryStr += ("'"+column[head]+"',");
//         }
//     }
//     qryStr = qryStr.slice(0, -1);
//     qryStr += (")");

//     const sqlQry = "CALL create_project_day_protion(\""+qryStr+"\");";    
//     db.query(sqlQry, (error, result) => {
//         if(error){
//             console.log(error);
//             res.send('Something went wrong. Please try again.');
//         }
//     }); 
// });
// //Get one project daily work for a specific projects day protion
// router.get('/_project_day_protion_daily_work/:id',(req,res) => {
//     // console.log('oo');
// });
// //Update one project daily work for a specific projects day protion
// router.put('/_project_day_protion_daily_work/:id',(req,res) => {

//     const column = req.body;
//     var sqlUpdateRow = "";

//     for(var head in column){
//         sqlUpdateRow += (head+"='"+column[head]+"',");
//     }
//     sqlUpdateRow = sqlUpdateRow.slice(0, -1);
//     const sqlQry = "CALL update_project_day_protion("+req.params.id+",\""+sqlUpdateRow+"\");";
//     db.query(sqlQry, (error, result) => {
//         if(error){
//             console.log(error);
//             res.send('Something went wrong. Please try again.');
//         }
//     }); 
 
// });



module.exports = router;
