const express = require("express");
const jsforce = require("jsforce");
require("dotenv").config();
const app = express();
const port = process.env.port || 3000;


//Create a Connection With Salesforce
const con = new jsforce.Connection({
    loginUrl: process.env.LoginUrl,
  });
  
  // Connect with the Salesfore Using Soap API
  con.login("jsforce@keykloud.com", "R12345678" + "8dF7pMlUiqTgrlmYbOfVCPL7",
    (err, userInfo) => {
      if (err) {
        console.error(err);
      } else {
        console.log("UserId:" + userInfo.id);
        console.log("OrganizationId:" + userInfo.organizationId);
      }
    });
    //Hello Word
app.get("/", (req, res) => {
    con.sobject("Account").describe((err, meta) => {
        if (err) { 
            return console.error(err); 
        }
        console.log('Label : ' + meta.label);
        console.log('Num of Fields : ' + meta.fields.length);
      
        // ...
      })
});

 app.get("/same", (req, res) => {
     con.describe("Account", (err, meta) => {
         if(err) {
             return console.error(err);
         }
         console.log('Label : ' + meta.label);
         console.log('Num of Fields : ' + meta.fields.length);
     })
 });

// describe global 
app.get("/global", (req, res) => {
    con.describeGlobal((err, result) => {
        if(err) {
            return console.error(err);
        }
        console.log('Num of SObjects : ' + result.sobjects.length);
    
    })
});
// cached metadata
app.get("/cache", (req, res) => {
    con.sobject("Account").describe$(function(err, meta) {
        if (err) {
             return console.error(err); 
            }
        console.log('Label : ' + meta.label);
        console.log('Num of Fields : ' + meta.fields.length);
        
      })
});




app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
  