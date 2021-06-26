const express = require("express");
const app = express();
const port = process.env.PORT || 3080;
const bcrypt = require('bcrypt');

const cors = require("cors");
const bodyParser = require("body-parser");
const ObjectID = require("mongodb").ObjectID;
require("dotenv").config();
app.use(cors());
app.use(express.json());
// console.log(process.env.DB_USER)

const { MongoClient } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ywwhy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const blogCollection = client.db(`${process.env.DB_NAME}`).collection("post");
  const adminCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection("admin");
  const usersCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection("users");

  // ------------------------------------
  app.post("/post", (req, res) => {
    const newPost = req.body;
    // console.log(newPost)
    blogCollection.insertOne(newPost).then((result) => {
      console.log(result);
      res.send(result.insertedCount > 0);
    });
  });
  app.post("/admin", (req, res) => {
    const admin = req.body;
    // console.log(newPost)
    adminCollection.insertOne(admin).then((result) => {
      console.log(result);
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/post", (req, res) => {
    blogCollection.find().toArray((err, document) => {
      res.send(document);
    });
  });

  app.get("/post/:id", (req, res) => {
    const id = ObjectID(req.params.id);
    // console.log(id)
    blogCollection.find({ _id: id }).toArray((err, document) => {
      res.send(document);
    });
  });

  // --------------------------------------------

  app.post("/users", async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    const newUser = {
      name: req.body.name,
      email: req.body.email,
      password: hashedPass,
    };
   
    usersCollection.insertOne(newUser).then((result) => {
      console.log(result);
      res.send(result.insertedCount > 0);
    });
  });


  app.post("/login", (req, res) => {
   usersCollection.find({ email:req.body.email }).toArray((err, documents) => {
     bcrypt.compare(req.body.password, documents[0].password).then(data => {
     
      //  console.log(data)
      //  console.log(documents)
      if(data){
        adminCollection.find({email: req.body.email}).toArray((err, doc) => {
          console.log(doc)
          if(documents[0].email===doc[0]?.email){
            const userInfo= {
              name:documents[0].name,
              email:documents[0].email,
              isAdmin: true,
              
            }
            res.send(userInfo)
          }else{

            const userInfo= {
              name:documents[0].name,
              email:documents[0].email,
              isAdmin: false,
              
            }
            res.send(userInfo)

          }
        })
      }else{
        res.send("auth error")
      }
     })
     
   })
 
  })

  // client.close();
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
