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

// how get/load products data from server
app.get("/products", (req, res) => {
  client = new MongoClient(uri, { useNewUrlParser: true });

  client.connect((err) => {
    const collection = client.db("onlineStore").collection("products");
    // perform actions on the collection object
    collection.find().toArray((err, documents) => {
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

// how get/load orders history data from server
app.get("/orders", (req, res) => {
  client = new MongoClient(uri, { useNewUrlParser: true });

  client.connect((err) => {
    const collection = client.db("onlineStore").collection("orders");
    // perform actions on the collection object
    collection.find().toArray((err, documents) => {
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

// how get dynamic data of products key asked by user from server
app.get("/product/:key", (req, res) => {
  const key = req.params.key; // read user request

  client = new MongoClient(uri, { useNewUrlParser: true });

  client.connect((err) => {
    const collection = client.db("onlineStore").collection("products");
    // perform actions on the collection object
    collection.find({ key: key }).toArray((err, documents) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: err });
      } else {
        res.send(documents[0]);
      }
    });

    client.close();
  });
});

// how to post data to mongodb server
app.post("/getProductsByKey", (req, res) => {
  const key = req.params.key; // read user request
  const productKeys = req.body;

  client = new MongoClient(uri, { useNewUrlParser: true });

  client.connect((err) => {
    const collection = client.db("onlineStore").collection("products");
    // perform actions on the collection object
    collection.find({ key: { $in: productKeys } }).toArray((err, documents) => {
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

// how to post all product data to server
app.post("/addProduct", (req, res) => {
  // save to database
  const product = req.body;
  client = new MongoClient(uri, { useNewUrlParser: true });

  client.connect((err) => {
    const collection = client.db("onlineStore").collection("products");
    // perform actions on the collection object
    collection.insert(product, (err, result) => {
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

// how to post all order data to server
app.post("/placeOrder", (req, res) => {
  // save to database
  const orderDetails = req.body;
  orderDetails.orderTime = new Date();

  client = new MongoClient(uri, { useNewUrlParser: true });

  client.connect((err) => {
    const collection = client.db("onlineStore").collection("orders");
    // perform actions on the collection object
    collection.insertOne(orderDetails, (err, result) => {
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

const port = process.env.PORT || 3001;
app.listen(port, () => console.log("Listen to port 3001"));
