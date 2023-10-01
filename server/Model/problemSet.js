const mongoose = require('mongoose');
const User = require('./user.js');
const Problem = require('./problem.js');

const problemSet_Schema = new mongoose.Schema({
    problemSetName : {
        type : String,
        required : true
    },
    createdBy : {
        //Check if the id is valid or not
        type : mongoose.SchemaTypes.ObjectId,
        ref : 'User'
    },
    createdAt : {
        type : Date,
        immutable : true,
        default : () => Date.now()
    },
    problems : [{
        //Check if the id is a valid id or not
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Problem'
    }]
});

let ProblemSet = mongoose.model("ProblemSet", problemSet_Schema);
module.exports = ProblemSet;