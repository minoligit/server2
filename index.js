const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors({exposedHeaders: ['Content-Range']}));

const columns = require('./permission/columns.json');
const { json } = require('body-parser');

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "_me_production (1)"
});
const db2 = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "react_app"
});

//Get Project Columns
app.get('/getAccess/:role/:resource/:option',(req,res) =>{
    const role = req.params.role;
    const resource = req.params.resource;
    const option = req.params.option;

    Object.entries(columns).forEach(([key1, value1]) => {
        if(key1==role){
            Object.entries(value1).forEach(([key2,value2]) => {
                if(key2==resource){
                    Object.entries(value2).forEach(([key3,value3]) => {
                        if(key3==option){
                            res.send(value3);
                        }
                    })
                }
            })
        }
    });
});
//Get Bulk Edit Columns
app.get('/getEditColumns/:role/:resource',(req,res) =>{
    const role = req.params.role;
    const resource = req.params.resource;

    Object.entries(columns).forEach(([key1, value1]) => {
        if(key1==role){
            Object.entries(value1).forEach(([key2,value2]) => {
                if(key2==resource){
                    Object.entries(value2).forEach(([key3,value3]) => {
                        if(key3=='list'){
                            res.send(value3);
                        }
                    })
                }
            })
        }
    });
});

//Login Operations
app.post('/verifyLogin',(req,res) => {
    const username = req.body.userName;
    const password = req.body.password;

    const sqlVerifyLogin = "SELECT _user.emp_no,_role.role_alias FROM _user LEFT JOIN _role ON "+
        "_user.role_id=_role.role_id WHERE _user.emp_no ='"+username+"' && _user.passwd = md5('"+
        password+"') LIMIT 1";
    db.query(sqlVerifyLogin, (error, result) => {
        res.send(result);
    });
});
app.post('/getLoggedUser',(req,res) => {

    const empNo = req.body.userId;
    const sqlLoggedUser = "SELECT _user.*,_role.* FROM _user LEFT JOIN _role ON _user.role_id=_role.role_id WHERE _user.emp_no ="
        +empNo+" LIMIT 1";
    db.query(sqlLoggedUser, (error, result) => {
        res.send(result);
    });
});

//Users Operations
app.get('/users',(req,res) => {

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
    const sqlSelectAll = "CALL get_all_user(\"("+qryStr+")\",\""+sortBy+"\",\""+order+"\","+start+","+end+");";
    db.query(sqlSelectAll, (error, result) => {
        res.header('Content-Range',result.length);
        res.send(result[0]);
    }); 
});
app.post('/users',(req,res) => {
    const sqlQry = "CALL create_user("+req.body.emp_no+",'"+req.body.ldap_uname+"','"+
        req.body.full_name+"','"+req.body.role_alias+"','"+req.body.ldap_id+"','"+req.body.state+"');";    
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send('Something went wrong. Please try again.');
        }
    }); 
});
app.get('/users/:id',(req,res) => {
    // console.log(req.params.id);
});
app.put('/users/:id',(req,res) => {

    const column = req.body;
    var sqlUpdateRow = "";

    for(var head in column){
        sqlUpdateRow += (head+"='"+column[head]+"',");
    }
    sqlUpdateRow = sqlUpdateRow.slice(0, -1);

    const sqlQry = "CALL update_user("+req.params.id+",\""+sqlUpdateRow+"\");";
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send('Something went wrong. Please try again.');
        }
        res.send(null);
    }); 
});
app.put('/users',(req,res) => {
    console.log("mmm",req.body);
});
app.delete('/users/:id',(req,res) => {

    const sqlQry = "CALL delete_user("+req.params.id+");";
    db.query(sqlQry, (error, result) => {
        console.log(error);
    }); 
});
app.get('/userLogins/:id',(req,res) => {
    const sqlQry = "CALL get_user_logins("+req.params.id+");";
    db.query(sqlQry, (error, result) => {
        res.header('Content-Range',result.length);
        res.send(result[0]);
    }); 
});
app.put('/editUsers/:role/:ids',(req,res) => {

    const ids = JSON.parse(req.params.ids);
    const headers = columns[req.params.role]["users"]["list"];
    const all = req.body;

    var sqlStr = "UPDATE _user SET ";

    for(var value in all){
        if(all[value]!==null){
            sqlStr += (headers[value].field+"='"+all[value]+"',");   
        }    
    }
    sqlStr = sqlStr.slice(0, -1);
    sqlStr += (" WHERE ( ");
    for(var value in ids){
        sqlStr += ("user_id="+ids[value]+"||");
    }
    sqlStr = sqlStr.slice(0, -2);
    sqlStr += (" )");

    db.query(sqlStr, (error, result) => {
        res.send(result);
    });
});

app.put('/updateCell/:id/:column/:value',(req,res) => {

    const sqlStr = "UPDATE _user SET "+req.params.column+"='"+req.params.value+"' WHERE user_id="+req.params.id+"";
    db.query(sqlStr, (error, result) => {
        res.send(error);
    });
});
app.get('/getEditUsers/:role/:ids',(req,res) => {

    const ids = JSON.parse(req.params.ids);
    const headers = columns[req.params.role]["users"]["list"];

    var sqlStr = "SELECT user_id AS ";
    for(var head in headers){
        sqlStr += (headers[head].field+",");   
    }
    sqlStr = sqlStr.slice(0, -1);

    sqlStr += (" FROM _user WHERE ");
    for(var num in ids){
        sqlStr += ("user_id="+ids[num]+" || ");   
    }
    sqlStr = sqlStr.slice(0, -3);

    db.query(sqlStr, (error, result) => {
        res.send(result);
    });
});


//Projects Operations
app.get('/projects',(req,res) => {

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
    const sqlQry = "CALL get_all_projects(\"("+qryStr+")\",\""+sortBy+"\",\""+order+"\","+start+","+end+");";
    db.query(sqlQry, (error, result) => {
        res.header('Content-Range',result.length);
        res.send(result[0]);
    }); 
});
app.post('/projects',(req,res) => {

    const sqlQry = "CALL create_projects('"+req.body.pro_name+"','"+req.body.svr_id+"','"+
        req.body.tech_name+"','"+req.body.status+"');";
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send('Something went wrong. Please try again.');
        }
    }); 

});
app.get('/projects/:id',(req,res) => {
    // console.log('oo');
});
app.put('/projects/:id',(req,res) => {

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
        else{
            sqlUpdateRow += (head+"='"+column[head]+"',");
        }
    }
    sqlUpdateRow = sqlUpdateRow.slice(0, -1);
    const sqlQry = "CALL update_project("+req.params.id+",\""+sqlUpdateRow+"\");";
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send('Something went wrong. Please try again.');
        }
    }); 
 
});
app.delete('/projects/:id',(req,res) => {

    const sqlQry = "CALL delete_project("+req.params.id+");";
    db.query(sqlQry, (error, result) => {
        console.log(error);
    }); 
});

app.get('/proUsers/:id',(req,res) => {
    const sqlQry = "CALL get_project_users("+req.params.id+");";
    db.query(sqlQry, (error, result) => {
        res.header('Content-Range',result.length);
        res.send(result[0]);
    }); 
});
app.get('/proUsers/:id',(req,res) => {
    console.log(req.params.id);
});
app.put('/proUsers/:id',(req,res) => {

    const column = req.body;
    var sqlUpdateRow = "";

    for(var head in column){
        sqlUpdateRow += (head+"='"+column[head]+"',");
    }
    sqlUpdateRow = sqlUpdateRow.slice(0, -1);

    // const sqlQry = "CALL update_user("+req.params.id+",\""+sqlUpdateRow+"\");";
    // db.query(sqlQry, (error, result) => {
    //     if(error){
    //         console.log(error);
    //         res.send('Something went wrong. Please try again.');
    //     }
    // }); 
    console.log(sqlUpdateRow);

});
app.get('/proServers/:id',(req,res) => {
    // console.log(req.params.id);
    const sqlQry = "CALL get_project_server('"+req.params.id+"');";
    db.query(sqlQry, (error, result) => {
        // res.header('Content-Range',result.length);
        res.send(result[0]);
    }); 
});

// app.get('/projects/technologies/:id',(req,res) => {
//     console.log(req.body.data);
//     // const sqlQry = "CALL update_projects("+req.params.id+",'"+req.params.pro_name+"',"+req.params.svr_id+",'"+
//     //     req.params.tech_name+"',"+req.params.status+");";
//     // db.query(sqlQry, (error, result) => {
//     //     console.log(error);
//     //     // res.header('Content-Range',result.length);
//     // }); 
// });

app.get('/proSessions/:id',(req,res) => {
    const sqlQry = "CALL get_project_sessions("+req.params.id+");";
    db.query(sqlQry, (error, result) => {
        res.header('Content-Range',result.length);
        res.send(result[0]);
    }); 
});
app.get('/proDailyWork/:id',(req,res) => {
    const sqlQry = "CALL get_project_daily_work("+req.params.id+");";
    db.query(sqlQry, (error, result) => {
        res.header('Content-Range',result.length);
        res.send(result[0]);
    }); 
});


//Servers Operations

app.get('/servers',(req,res) => {

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
    const sqlQry = "CALL get_all_server(\"("+qryStr+")\",\""+sortBy+"\",\""+order+"\","+start+","+end+");";
    db.query(sqlQry, (error, result) => {
        res.header('Content-Range',result.length);
        res.send(result[0]);
    }); 
});
app.post('/servers',(req,res) => {

    const sqlQry = "CALL create_server('"+req.body.svr_alias+"','"+req.body.dir_svr_ip+"','"+
        req.body.clip_svr_ip+"','"+req.body.mvm_name+"');";
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send('Something went wrong. Please try again.');
        }
    }); 

});
app.get('/servers/:id',(req,res) => {
});
app.put('/servers/:id',(req,res) => {

    const column = req.body;
    var sqlUpdateRow = "";

    for(var head in column){
        sqlUpdateRow += (head+"='"+column[head]+"',");
    }
    sqlUpdateRow = sqlUpdateRow.slice(0, -1);

    const sqlQry = "CALL update_server("+req.params.id+",\""+sqlUpdateRow+"\");";
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send('Something went wrong. Please try again.');
        }
    });   
});
app.delete('/servers/:id',(req,res) => {

    const sqlQry = "CALL delete_server("+req.params.id+");";
    db.query(sqlQry, (error, result) => {
        console.log(error);
    }); 
});

//Roles Operations
app.get('/roles',(req,res) => {

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
    const sqlSelectAll = "CALL get_all_role(\"("+qryStr+")\",\""+sortBy+"\",\""+order+"\","+start+","+end+");";
    db.query(sqlSelectAll, (error, result) => {
        res.header('Content-Range',result.length);
        res.send(result[0]);
    }); 
});
app.post('/roles',(req,res) => {
    const sqlQry = "CALL create_role("+req.body.emp_no+",'"+req.body.ldap_uname+"','"+
        req.body.full_name+"','"+req.body.role_alias+"','"+req.body.ldap_id+"','"+req.body.state+"');";    
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send('Something went wrong. Please try again.');
        }
    }); 
});
app.get('/roles/:id',(req,res) => {
    // console.log(req.params.id);
});
app.put('/roles/:id',(req,res) => {

    const column = req.body;
    var sqlUpdateRow = "";

    for(var head in column){
        sqlUpdateRow += (head+"='"+column[head]+"',");
    }
    sqlUpdateRow = sqlUpdateRow.slice(0, -1);

    const sqlQry = "CALL update_role("+req.params.id+",\""+sqlUpdateRow+"\");";
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
            res.send('Something went wrong. Please try again.');
        }
        res.send(null);
    }); 
});
app.put('/roles',(req,res) => {
    console.log("mmm",req.body);
});
app.delete('/roles/:id',(req,res) => {

    const sqlQry = "CALL delete_role("+req.params.id+");";
    db.query(sqlQry, (error, result) => {
        console.log(error);
        res.send(result);
    }); 
});
app.put('/updateCell/:id/:column/:value',(req,res) => {

    const sqlStr = "UPDATE _role SET "+req.params.column+"='"+req.params.value+"' WHERE user_id="+req.params.id+"";
    db.query(sqlStr, (error, result) => {
        res.send(error);
    });
});


//Notifications Operations
app.get('/notifications',(req,res) => {

    const column = JSON.parse(req.query.filter);
    var qryStr = "archieve=0 ";
    const start = (JSON.parse(req.query.range)[0]);
    const end = (JSON.parse(req.query.range)[1]);
    const sortBy = (JSON.parse(req.query.sort)[0]);
    const order = (JSON.parse(req.query.sort)[1]);

    if(column!=null){
        for(var head in column){
            qryStr += ("&& "+head+"='"+column[head]+"' ");
        }
    }
    const sqlQry = ("SELECT ntf_id AS id, title,content,dateTime,status,archieve FROM notifications WHERE ("+
        qryStr+") ORDER BY dateTime");
    db2.query(sqlQry, (error, result) => {
        res.header('Content-Range',result.length);
        res.send(result);
    }); 
});
app.get('/notifications/:id',(req,res) => {
});
app.get('/getUnreadCount/:id',(req,res) => {
    
    const sqlQry = ("SELECT COUNT(ntf_id) as count FROM notifications WHERE (status=0 && emp_no ="+req.params.id+")");
    db2.query(sqlQry, (error, result) => {
        res.send(result);
    }); 
});
app.delete('/notifications/:id',(req,res) => {

    // const sqlQry = "DELETE FROM notifications WHERE ntf_id="+req.params.id+");";
    // db2.query(sqlQry, (error, result) => {
    //     console.log(error);
    // }); 
    console.log(req.params.id);
});

const PORT = 8080;
app.listen(PORT, function() {
    console.log('Server is running.')
});