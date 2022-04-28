const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const app = express();
// require("dotenv").config();

// middleware
app.use(cors());
app.use(express());

app.get("/", (req, res) => {
  res.send(
    "running warehouse management server  and i have to complete this porject within 24 hours"
  );
});

app.listen(port, () => {
  console.log("listening to port", port);
});
