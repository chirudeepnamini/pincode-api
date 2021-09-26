const express = require("express");
const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.URI);
var database, coll;
const statecodes_obj = require("./statecodes");
require("dotenv").config();
async function db_conn() {
  await client.connect();
  database = client.db("pincode-db");
  coll = database.collection("pincode-coll");
  console.log("done");
}

const app = express();
app.use(express.json());
app.get("/", async (req, res) => {
  var queryobj = {};
  if (req.query.stateid) {
    queryobj["StateName"] = statecodes_obj.statecodes[req.query.statecode];
  }
  if (req.query.District) {
    queryobj["District"] = req.query.district;
  }
  if (req.query.Pincode) {
    queryobj["Pincode"] = req.query.pincode;
  }
  if (req.query.DivisionName) {
    queryobj["DivisionName"] = req.query.divisionName;
  }
  console.log(queryobj);
  try {
    var result_cursor = await coll.find(queryobj);
    result_cursor = await result_cursor.toArray();
  } catch (err) {
    console.log("in errror", err);
  }
  res.json(result_cursor);
});
app.listen(process.env.PORT || 3000, async function () {
  await db_conn();
});
