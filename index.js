const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const app = express();
require("dotenv").config();

// middleware
app.use(cors());
app.use(express());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mp2nv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("travelTourism");
    const inventoryCollection = database.collection("inventory");
    const bookingCollection = database.collection("booking");

    //GET API
    app.get("/inventory", async (req, res) => {
      const cursor = inventoryCollection.find({});
      const inventory = await cursor.toArray();
      res.send(inventory);
    });

    app.get("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await inventoryCollection.findOne(query);
      res.json(service);
    });

    //POST API
    app.post("/inventory", async (req, res) => {
      const service = req.body;
      console.log("hit the post api", service);

      const result = await inventoryCollection.insertOne(service);
      console.log(result);
      res.json(result);
    });
    //DELETE API
    app.delete("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookingCollection.deleteOne(query);
      res.json(result);
    });

    //Add Booking API
    app.post("/booking", async (req, res) => {
      const booking = req.body;
      const result = await bookingCollection.insertOne(booking);
      res.json(result);
    });
    // Get Booking Data
    app.get("/booking", async (req, res) => {
      const cursor = bookingCollection.find({});
      const booking = await cursor.toArray();
      res.send(booking);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("hikero warehouse");
});

app.listen(port, () => {
  console.log("listening to port", port);
});
