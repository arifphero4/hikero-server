const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
const app = express();
require("dotenv").config();

// middleware
app.use(cors());
app.use(express());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hf6om.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const itemCollection = client.db("hikeroInventoty").collection("inventory");

    // http://localhost:5000/inventory
    app.get("/inventory", async (req, res) => {
      const query = {};
      const cursor = itemCollection.find(query);
      const items = await cursor.toArray();
      res.send(items);
    });

    app.get("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const item = await itemCollection.findOne(query);
      res.send(item);
    });

    // quantity decreasing
    app.put("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const updateQuantity = req.body;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDatabase = {
        $set: {
          quantity: updateQuantity.quantity,
        },
      };
      const result = await itemCollection.updateOne(
        query,
        updateDatabase,
        options
      );
      res.send(result);
    });

    // find myItem api
    app.get("/myitem", async (req, res) => {
      const email = req.query?.email;
      const query = { email: email };
      const cursor = itemCollection.find(query);
      const myitems = await cursor.toArray();
      res.send(myitems);
    });

    //delete product
    app.delete("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await itemCollection.deleteOne(query);
      console.log(result);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("running HIKERO server");
});

app.listen(port, () => {
  console.log("listening to port", port);
});
