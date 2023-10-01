const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

app.use("/", require("./routes/index"))

require("./config/mongoConnection");
// require("./config/allProblems");

const port = process.env.PORT;

app.listen(port || 4000, () => {
  console.log("Listening on 4000..");
});
