const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('./connection.js');

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

function isNumeric(num){
    return !isNaN(num)
};
function isList(req,res,table){

    // const column = JSON.parse(req.query.filter);
    // var qryStr = "1 ";
    const start = (JSON.parse(req.query.range)[0]);
    const end = (JSON.parse(req.query.range)[1]);
    const sortBy = (JSON.parse(req.query.sort)[0]);
    const order = (JSON.parse(req.query.sort)[1]);

    // if(column!=null){
    //     for(var head in column){
    //         qryStr += ("&& "+head+"='"+column[head]+"' ");
    //     }
    // }
    
    const sqlQry = ("SELECT * FROM "+table+" ORDER BY "+sortBy+
        " "+order+" LIMIT "+(end-start+1)+" OFFSET "+start+";");
    console.log(sqlQry);
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
        }
        res.header('Content-Range',result.length);
        res.send(result);
    }); 
};
function isFilter(req,res,table){

    const column = JSON.parse(req.query.filter).column;
    const option = JSON.parse(req.query.filter).option;
    const value = JSON.parse(req.query.filter).value;
    var qryStr = "1 ";
    const start = (JSON.parse(req.query.range)[0]);
    const end = (JSON.parse(req.query.range)[1]);
    const sortBy = (JSON.parse(req.query.sort)[0]);
    const order = (JSON.parse(req.query.sort)[1]);

    for(var i=0;i<column.length;i++){
        if(column[i]!==null && option[i]!==null && value[i]!==null){
            // if(isNumeric(value[i])){
            //     qryStr += ("&& "+column[i]+option[i]+value[i]+" ");
            // }
            if(option[i]==="Is Not Empty"){
                qryStr += ("&& "+column[i]+"!==null ");
            }
            else if(option[i]==="Empty"){
                qryStr += ("&& "+column[i]+"===null ");
            }
            else if(option[i]==="Less Than"){
                qryStr += ("&& "+column[i]+"<"+value[i]+" ");
            }
            else if(option[i]==="More Than"){
                qryStr += ("&& "+column[i]+">"+value[i]+" ");
            }
            else if(option[i]==="Starts With"){
                qryStr += ("&& "+column[i]+" LIKE '"+value[i]+"%' ");
            }
            else if(option[i]==="Equals"){
                qryStr += ("&& "+column[i]+"='"+value[i]+"' ");
            }
            else if(option[i]==="Contains"){
                qryStr += ("&& "+column[i]+" LIKE '%"+value[i]+"%' ");
            }
            else{
                // qryStr += ("&& "+column[i]+option[i]+"'"+value[i]+"' ");
            }
        }
    }
    qryStr += ("");

    const sqlQry = ("SELECT * FROM "+table+" WHERE ("+qryStr+") ORDER BY "+sortBy+
        " "+order+" LIMIT "+(end-start+1)+" OFFSET "+start+";");
        console.log(sqlQry);
    db.query(sqlQry, (error, result) => {
        if(error){
            console.log(error);
        }
        res.header('Content-Range',result.length);
        res.send(result);
    }); 
}

function printList(req,res,table){

    if(req.query.filter==='[object Object]'){
        console.log("List");
        isList(req,res,table);
        // console.log("Filter");
        // isFilter(req,res,table);
    }
    else{
        console.log("Filter");
        isFilter(req,res,table);
        // console.log("List");
        // isList(req,res,table);
    }
}
function sendError(errNo,sqlMsg){
    if(errNo==1048){
        return(sqlMsg);
    }
    else if(errNo==1054){
        return(sqlMsg);
    }
    else if(errNo==1062){
        return("Duplicate entry for unique values.");
    }
    else if(errNo==1451){
        return("Cannot delete or update the row.");
    }
    else{
        return("Something went wrong.Please try again.")
    }
}


module.exports = {isList,isFilter,printList,sendError};