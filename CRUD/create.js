const express = require('express');
const jsforce =require('jsforce');
const app = express();
require('dotenv').config();
const port = process.env.port || 3003


const con = new jsforce.Connection({
    loginUrl : process.env.loginUrl
})

//Login with salesforce soap API
con.login("jsforce@keykloud.com", "R12345678"+"8dF7pMlUiqTgrlmYbOfVCPL7" ,(err, userInfo)=>{
    if(err){
        console.error(err);
    }
    else{
        console.log("User Id Is: "+userInfo.id);
        console.log('Organizaion Id is: '+userInfo.organizationId);
    }
})
app.get('/', (req, res)=>{
    res.send('Welcome In the KeyKloud');
})

// Create Bulk Records
app.get('/create', (req, res)=>{
    var accounts = [];
    for(var i=0;i<10;i++){
        accounts.push({Name : 'Rahul dummy data'+(i+1)});
    }
    con.sobject("Account").create(accounts, {allowRecursive : true}, (err, result)=>{
        if(err){
            return console.error(err);
        }
        console.log("Accounts Created:"+ result.length);
    })
});

//update bulk Records 
app.get('/update', (req, res)=>{
    con.sobject("Account")
    .find({CreatedDate : jsforce.Date.TODAY})
    .update({Name : "Rahul yadav Updated Records"},
     (err, results)=>{
        if(err){
            return console.log(err);
        }
        console.log("updation Successful");
    })
})

//Delete bulk Records
app.get('/delete', (req, res)=>{
    con.sobject('Account')
    .find({ CreatedDate : jsforce.Date.TODAY })
    .destroy(function(err, rets) {
      if (err) {
        return console.error(err);
      }
      console.log(rets.length);
    });
})
app.listen(port, ()=>{
    console.log(`server Runnning at http://localhost:${port}`);
})