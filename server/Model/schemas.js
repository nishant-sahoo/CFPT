const mongoose = require('mongoose');
const validateEmail = require("../Utils/index").validateEmail;

const Users = mongoose.model('Users', new mongoose.Schema({
    name : {
        type : String,
        trim : true, 
        required : [true, "Enter your name"],
        match : [/^[a-zA-Z\s]*$/g, "Name should contain only alphabets and spaces."]
    },
    handle : {
        type : String,
        trim : true,
        required : [true, "Handle cannot be empty"],
        unique : [true, "This handle is currently in use"],
        minlength : [3, "Handle should contain between 3 and 24 characters, inclusive."],
        maxlength : [24, "Handle should contain between 3 and 24 characters inclusive."],
        match : [/^[a-zA-Z0-9-_]+$/, "Handle should contain alphabets, digits, underscore and hyphen only."]
    },
    email : {
        type : String,
        trim : true,
        required : [true, "Enter your email"],
        lowercase : true,
        unique : [true, "This email is currently in use"],
        validate : [validateEmail, "Enter a valid email"],
        match : [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Enter a valid email"]
    },
    password : {
        //Take care that password has minimum length & maximum length
        //Take care that password contains special characters, alphabets & numbers
        type : String,
        required : true
    },
    isAdmin : {
        type : Boolean, 
        required : true
    },
    rating : {
        type : Number,
        required : true
    },
    maxRating : {
        type : Number,
        required : true
    },
    solvedProblems : [{
        //Check whether the id exists or no
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Problems'
    }],
    organization : {
        type : String
    },
    country : [{
        type : String
    }],
    profilePhoto : {
        //Validate if the link is a correct link or not
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        immutable : true,
        default : () => Date.now()
    },
    groups : [{
        //Check whether the id exists or no
        type : mongoose.SchemaTypes.ObjectId,
        ref : 'Events'
    }],
    streakOfPOTD : [{
        problem : [{
            //Check whether the id exists or no
            type : mongoose.Schema.Types.ObjectId,
            ref : 'POTDs'
        }],
        solved : Boolean,
        streakOfPOTDInfo : {
            maxPOTDStreak : {
                type : Number,
            },
            maxPOTDStreakEnd : {
                type : Date
            },
            currentPOTDStreak: {
                type : Number
            }
        }
    }]
}));

const POTDs = mongoose.model('POTDs', mongoose.Schema({
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
        immutable : true,
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
        ref : 'Users'
    }],
    tags : [{
        //Validate if the id exists or no
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Problems'
    }],
    solutionLink : {
        //Validate if the link works or no
        type : String
    }
}));

const Tags = mongoose.model('Tags', new mongoose.Schema({
    tag : {
        type : String,
        unique : true,
        lowercase : true
    }
}));

const ProblemSets = mongoose.model('ProblemSets', new mongoose.Schema({
    problemSetName : {
        type : String,
        required : true
    },
    createdBy : {
        //Check if the id is valid or not
        type : mongoose.SchemaTypes.ObjectId,
        ref : 'Users'
    },
    createdAt : {
        type : Date,
        immutable : true,
        default : () => Date.now()
    },
    problems : [{
        //Check if the id is a valid id or not
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Problems'
    }]
}));

const Problems = mongoose.model('Problems', new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    id : {
        //Ensure it is of the format as a codeforces id
        //Ensure that problems getting inserted are unique
        type : String,
        required : true,
        unique : [true, "Problem Already Exists"]
    },
    rating : {
        type : Number,
    },
    tags : [{
        //Ensure that the id exists or not
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Tags'
    }],
    peopleSolved : [{
        //Ensure that the id exists or not
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Users'
    }]
}));

const Events = mongoose.model('Events', new mongoose.Schema({
    eventName : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        immutable : true,
        default : () => Date.now()
    },
    isArchived : {
        type : Boolean, 
        isRequired : true
    },
    allProblems : [{
        //Check whether the id exists or not
        type : mongoose.Schema.Types.ObjectId,
        ref : 'ProblemSets'
    }],
    peopleRegistered : [{
        //Check whether the id exists or not
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Users'
    }]
}));

module.exports = {Users, POTDs, Tags, ProblemSets, Problems, Events};