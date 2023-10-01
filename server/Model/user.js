const mongoose = require("mongoose");
const validateEmail = require("../Utils/index").validateEmail;
const Problem = require("./problem.js");
const Event = require("./event.js");
const POTD = require("./potd.js");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Enter your name"],
    match: [/^[a-zA-Z\s]*$/g, "Name should contain only alphabets and spaces."],
  },
  handle: {
    type: String,
    // trim: true,
    // required: [true, "Handle cannot be empty"],
    // unique: [true, "This handle is currently in use"],

    // minlength: [
    //   3,
    //   "Handle should contain between 3 and 24 characters, inclusive.",
    // ],
    // maxlength: [
    //   24,
    //   "Handle should contain between 3 and 24 characters inclusive.",
    // ],
    // match: [
    //   /^[a-zA-Z0-9-_]+$/,
    //   "Handle should contain alphabets, digits, underscore and hyphen only.",
    // ],
  },
  email: {
    type: String,
    trim: true,
    required: [true, "Enter your email"],
    lowercase: true,
    unique: [true, "This email is currently in use"],
    validate: [validateEmail, "Enter a valid email"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Enter a valid email",
    ],
  },
  verified: {
    type: Boolean,
    required: [true],
    default: false,
  },
  password: {
    //Take care that password has minimum length & maximum length
    //Take care that password contains special characters, alphabets & numbers
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    // required: true,
  },
  maxRating: {
    type: Number,
    // required: true,
  },
  solvedProblems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
    },
  ],
  markedProblems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
    },
  ],
  organization: {
    type: String,
  },
  country: [
    {
      type: String,
    },
  ],
  profilePhoto: {
    //Validate if the link is a correct link or not
    type: String,
    // required: true,
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  groups: [
    {
      //Check whether the id exists or no
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Event",
    },
  ],
  streakOfPOTD: [
    {
      problem: [
        {
          //Check whether the id exists or no
          type: mongoose.Schema.Types.ObjectId,
          ref: "POTD",
        },
      ],
      solved: Boolean,
      streakOfPOTDInfo: {
        maxPOTDStreak: {
          type: Number,
        },
        maxPOTDStreakEnd: {
          type: Date,
        },
        currentPOTDStreak: {
          type: Number,
        },
      },
    },
  ],
});

let User = mongoose.model("User", userSchema);
module.exports = User;
