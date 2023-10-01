const mongoose = require("mongoose");

const standingSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  userinfo: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
    {
      solves: {
        type: Number,
        default: 0,
      },
    },
  ],
  problems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
    },
  ],
});

let Standing = mongoose.model("Standing", standingSchema);
module.exports = Standing;
