
const express = require('express')
const app = express()
const port = process.env.PORT || 3080

const cors = require("cors");
const bodyParser = require("body-parser");
const ObjectID = require("mongodb").ObjectID;
require("dotenv").config();
app.use(cors());
app.use(express.json());
// console.log(process.env.DB_USER)



const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ywwhy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const blogCollection = client.db(`${process.env.DB_NAME}`).collection("post");

  // perform actions on the collection object
  client.close();
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})