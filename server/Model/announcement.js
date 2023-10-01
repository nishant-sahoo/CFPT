const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
    description : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        immutable : true,
        default : () => Date.now()
    },
})

let Announcement = mongoose.model("Announcement", announcementSchema);
module.exports = Announcement;