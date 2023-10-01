const mongoose = require("mongoose");
const ProblemSet = require("./problemSet.js");
const User = require("./user.js");

const eventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  isArchived: {
    type: Boolean,
    isRequired: true,
  },
  allProblems: [
    {
      //Check whether the id exists or not
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProblemSet",
    },
  ],
  peopleRegistered: [
    {
      //Check whether the id exists or not
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  standing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Standing",
  },
});

let Event = mongoose.model("Event", eventSchema);
module.exports = Event;
