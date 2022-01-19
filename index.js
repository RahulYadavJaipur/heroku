/*
   Created By Rahul Yadav On 01/13/2022
*/
const express = require("express");
const jsforce = require("jsforce");
require('dotenv').config();
const app = express();
const port = process.env.port || 3000

const {LoginUrls, USER_NAME, PASSWORD, TOKEN} = process.env;

//Create a Connection With Salesforce
const con = new jsforce.Connection({

 loginUrl : LoginUrls
});

// Connect with the Salesfore Using Soap API
con.login(USER_NAME, PASSWORD + TOKEN, (err, userInfo) => {
    if (err) {
      console.error(err);
    } else {
      console.log("UserId:" + userInfo.id);
      console.log("OrganizationId:" + userInfo.organizationId);
    }
  });

//Hello Word
app.get("/", (req, res) => {
    res.send("Hello Word");
    
});

// Read Operation
app.get("/read", (req, res) => {
  con.query("SELECT Id, Name FROM Account", (err, result) => {
    if (err) {
      res.send(err);
    } else {
      // console.log("Total Recors:"+result.size);
      res.json(result.records);
    }
  })
  // res.send("Hello Word")
});

//create Operation
var created_Id;
app.get("/create", (req, res) => {
  con.sobject("Account")
    .create({ Name: "Keykloud dummy" }, (err, Create_Result)=>{
      if (err || !Create_Result.success) {
        return console.error(err);
      }
      console.log("Created record id : " + Create_Result.id);
      created_Id = Create_Result.id;
      res.send("Record is Created");
    })
});

/*
//crate Multiple Records
app.get("/creates", (req, res) => {
  con.sobject("Account").create(
      [{ Name: "keykloud 1" }, { Name: "Keykloud 2" }],
      (err, Create_Results) => {
        if (err) {
          return console.error(err);
        }
        for (var i = 0; i < Create_Results.length; i++) {
          if (Create_Results[i].success) {
            console.log("Created record id : " + Create_Results[i].id);
          }
        }
      });
});
*/

var updated_Id;
//update Opertaion
app.get("/update", (req, res) => {
  con.sobject("Account")
    .update({ Id: "created_Id", Name: "Keykloud Private " },
      (err, updated_Result) => {
        if (err || !updated_Result.success) {
          return console.error(err);
        }
        console.log("Updated Successfully : " + updated_Result.id);
        //updated_Id=updated_Result.id;
        res.send("Recored is Updated");
      })
});

//Delete Operation
app.get("/delete", (req, res) => {
  con.sobject("Account").destroy(updated_Id, (err, delete_Result) => {
    if (err || !delete_Result.success) {
      return console.error(err);
    }
    console.log("Account is Deleted: " + delete_Result.id);
    res.send("Record is Deleted");
  })
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
