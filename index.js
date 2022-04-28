const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const app = express();
// require("dotenv").config();

// middleware
app.use(cors());
app.use(express());

app.get("/", (req, res) => {
  res.send("running warehouse management server ");
});

app.listen(port, () => {
  console.log("listening to port", port);
});
