const mongoose = require("mongoose");
const User = require("./user.js");
const Tag = require("./tag.js");

const problemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  id: {
    //Ensure it is of the format as a codeforces id
    //Ensure that problems getting inserted are unique
    type: String,
    required: true,
    unique: [true, "Problem Already Exists"],
  },
  rating: {
    type: Number,
  },
  tags: [
    {
      //Ensure that the id exists or not
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
    },
  ],
  peopleSolved: [
    {
      //Ensure that the id exists or not
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  peopleMarked: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Problem = mongoose.model("Problem", problemSchema);
module.exports = Problem;
