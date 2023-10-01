const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    tag : {
        type : String,
        unique : true,
        lowercase : true
    }
});

let Tag = mongoose.model("Tag", tagSchema);
module.exports = Tag;