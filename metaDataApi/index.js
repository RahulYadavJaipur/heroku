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
con.login("jsforce@keykloud.com","R12345678" + "8dF7pMlUiqTgrlmYbOfVCPL7",(err, userInfo) => {
    if (err) {
      console.error(err);
    } else {
      console.log("UserId:" + userInfo.id);
      console.log("OrganizationId:" + userInfo.organizationId);
    }
  });
//meta data api
app.get("/dd", (req, res) => {
   con.metadata.describe('39.0', function(err, metadata) {
      if (err) { 
        return console.error('err', err);
       }
      for (var i=0; i < metadata.length; i++) {
      var meta = metadata[i];
      console.log("organizationNamespace: " + meta.organizationNamespace);
      console.log("partialSaveAllowed: " + meta.partialSaveAllowed);
      console.log("testRequired: " + meta.testRequired);
      console.log("metadataObjects count: " + metadataObjects.length);
    }
  })
});

/*
app.get("/testMetaData", (req, res) => {
  var types = [{ type: "CustomObject", folder: null }];
  con.metadata.list(types, "42.0", function (err, metadata) {
    if (err) {
      return console.error("err", err);
    }
    var meta = metadata[0];
    console.log("metadata count: " + metadata.length);
    console.log("createdById: " + meta.createdById);
    console.log("createdByName: " + meta.createdByName);
    console.log("createdDate: " + meta.createdDate);
    console.log("fileName: " + meta.fileName);
    console.log("fullName: " + meta.fullName);
    console.log("id: " + meta.id);
    console.log("lastModifiedById: " + meta.lastModifiedById);
    console.log("lastModifiedByName: " + meta.lastModifiedByName);
    console.log("lastModifiedDate: " + meta.lastModifiedDate);
    console.log("manageableState: " + meta.manageableState);
    console.log("namespacePrefix: " + meta.namespacePrefix);
    console.log("type: " + meta.type);
  })
});
*/


app.get("/readAccount",(req,res) => {
  var fullNames = ['Account'];
  con.metadata.read('CustomObject', fullNames, function(err, metadatas) {
    if (err) { 
      console.error(err); 
    }
    console.log(metadatas); // It's Gonna Run
    res.json(metadatas);
   /*for (var i=0; i < metadatas.length; i++) {
      var meta = metadatas[i];
      //console.log(meta);
     console.log("Full Name: " + meta.fullName);
      //console.log("Fields count: " + meta.fields.length);
      //console.log("Sharing Model: " + meta.sharingModel);
    }  */ 
  })
});

app.get('/fieldSet', (req, res) => {
  var fullNames = [ 'Account.Account_External' ];
        con.metadata.read('FieldSet', fullNames, function(err, metadata) {


        if (err) { 
        console.error(err); 
        }
        res.json(metadata);
        console.log(metadata);
        console.log('Fieldset Label: '+ metadata.label);
        console.log('Fieldset Fullname: ' + metadata.fullName);
        for (var i=0; i < metadata.displayedFields.length; i++) {
            console.log("Field "+[i]+" inside field set: " + metadata.displayedFields[i].field);
        }

        });
})






app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
