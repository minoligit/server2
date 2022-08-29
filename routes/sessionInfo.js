const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const db = require('../connection.js');
const {isList,isFilter,printList} = require('../functions.js');

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


///////////////////////////////////////////////Session Info Operations///////////////////////////////////////////////
//Get list of all session info
router.get('/_session_info_list',(req,res) => {

    printList(req,res,"_view_session_info_list");
     
});
//Get one session info
router.get('/_session_info_list/:id',(req,res) => {
    // console.log('oo');
});




module.exports = router;