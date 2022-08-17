const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const select = express.Router();
const db = require('./connection.js');

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

select.get('/_role_alias_list',(req,res) => {

    const sqlQry = "SELECT DISTINCT role_alias,role_id FROM _role;";
    db.query(sqlQry, (error, result) => {
        // Object.keys(result).forEach(function(key){
        //     result[key].name = result[key].role_alias;
        // })
        res.send(result);
    }); 
});
select.get('/_pro_name_list',(req,res) => {

    const sqlQry = "SELECT DISTINCT pro_name,pro_id FROM _project;";
    db.query(sqlQry, (error, result) => {
        res.send(result);
    }); 
});
select.get('/_svr_alias_list',(req,res) => {

    const sqlQry = "SELECT DISTINCT svr_alias,svr_id FROM _server;";
    db.query(sqlQry, (error, result) => {
        res.send(result);
    }); 
});
select.get('/_tech_name_list',(req,res) => {

    const sqlQry = "SELECT DISTINCT tech_name,tech_id FROM _technology;";
    db.query(sqlQry, (error, result) => {
        res.send(result);
    }); 
});
select.get('/_target_fact_list',(req,res) => {

    const sqlQry = "SELECT DISTINCT tartget_fact,target_id FROM _project_target;";
    db.query(sqlQry, (error, result) => {
        res.send(result);
    }); 
});
select.get('/_mount_option_list',(req,res) => {

    const sqlQry = "SELECT DISTINCT _nfs_mount_option.option,opt_id FROM _nfs_mount_option;";
    db.query(sqlQry, (error, result) => {
        console.log(error);
        res.send(result);
    }); 
});
select.get('/_client_path_list',(req,res) => {

    const sqlQry = "SELECT DISTINCT client_path FROM _directory;";
    db.query(sqlQry, (error, result) => {
        res.send(result);
    }); 
});
select.get('/_portion_list',(req,res) => {

    const sqlQry = "SELECT DISTINCT portion,portion_id FROM _project_day_portion;";
    db.query(sqlQry, (error, result) => {
        res.send(result);
    }); 
});



module.exports = select;