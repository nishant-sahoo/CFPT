const mongoose = require('mongoose');
const User = require('./user.js');
const Problem = require('./problem.js');

const potd_Schema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        immutable : true,
        default : () => Date.now()
    },
    publishedAt : {
        type : Date,
        isRequired : true
    },
    linkToProblem : {
        //Validate if the link is a correct link or not
        type : String,
        isRequired : true,
    },
    usersAnswered : [{
        //Validate if the id exists or no
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }],
    tags : [{
        //Validate if the id exists or no
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Problem'
    }],
    solutionLink : {
        //Validate if the link works or no
        type : String
    }
});

let POTD = mongoose.model("POTD", potd_Schema);
module.exports = POTD;


