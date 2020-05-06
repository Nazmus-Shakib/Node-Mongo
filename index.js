const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

const app = express();

const uri = process.env.DB_PATH;

app.use(cors());
app.use(bodyParser.json());

let client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const user = ["Karim", "Rahim", "Jabbar", "Salam", "Rafiq"];

// how get/load data
app.get("/products", (req, res) => {
  client = new MongoClient(uri, { useNewUrlParser: true });

  client.connect((err) => {
    const collection = client.db("onlineStore").collection("products");
    // perform actions on the collection object
    collection
      .find({ stock: { $gt: 5 } })
      .limit(10)
      .toArray((err, documents) => {
        if (err) {
          console.log(err);
          res.status(500).send({ message: err });
        } else {
          res.send(documents);
        }
      });

    client.close();
  });
});

// how get dynamic data asked by user
// app.get("/user/:id", (req, res) => {
//   const id = req.params.id; // read user request
//   console.log(req.query.sort);
//   const name = user[id];
//   res.send({ id, name });
// });

// how to post data
app.post("/addProduct", (req, res) => {
  // save to database
  const product = req.body;
  client = new MongoClient(uri, { useNewUrlParser: true });

  client.connect((err) => {
    const collection = client.db("onlineStore").collection("products");
    // perform actions on the collection object
    collection.insertOne(product, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: err });
      } else {
        res.send(result.ops[0]);
      }
    });

    client.close();
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Listen to port 3000"));
