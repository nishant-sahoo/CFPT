const mongoose = require("mongoose");

const allProblemsSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    id : {
        type : String,
        required : true,
        unique: [true, "Problem Already Exists"],
    },
    rating : {
        type : Number,
    },
    tags : [String],
})

const AllProblems = mongoose.model("AllProblems", allProblemsSchema);
module.exports = AllProblems;