const db = process.env.DATABASE;

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

mongoose
  .connect(db)
  .then(() => {
    console.log("MONGO Success");
  })
  .catch((err) => {
    console.log("MONGO Failed", err);
  });
