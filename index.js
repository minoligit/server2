const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors({exposedHeaders: ['Content-Range']}));

const projectColumns = require('./columns/projects.json');
const serverColumns = require('./columns/servers.json');
const userColumns = require('./columns/users.json');

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "_me_production (1)"
});

//Get Project Columns
app.get('/getProjectColumns',(req,res) =>{
    res.send(JSON.stringify(projectColumns));
});
app.get('/getServerColumns',(req,res) =>{
    res.end(JSON.stringify(serverColumns));
});
app.get('/getUserColumns',(req,res) =>{
    res.end(JSON.stringify(userColumns));
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
    const sqlLoggedUser = "SELECT _user.*,_role.* FROM _user LEFT JOIN _role ON _user.role_id=_role.role_id WHERE _user.emp_no ="+empNo;
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
    }); 

});
app.put('/users',(req,res) => {
    console.log("mmm");
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


const PORT = 8080;
app.listen(PORT, function() {
    console.log('Server is running.')
});