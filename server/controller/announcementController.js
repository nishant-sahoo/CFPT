const Announcement = require("../Model/announcement");

module.exports.createAnnouncement = async (req, res) => {
    Announcement.create(
        {
            description: req.body.description,
        },
        (err, announcement) => {
        if (err) {
            console.log(err);
            return res.status(500).send("There was a problem creating the announcement.");
        }
        res.status(200).send({announcement: announcement, id: announcement._id});
        }
    );
}

module.exports.getAnnouncements = async (req, res) => {
    Announcement.find({}, (err, announcements) => {
        if(err)
        {
            console.log(err);
            return res.status(500).send("There was a problem fetching the announcement.");
        }
        res.status(200).send({announcement: announcements});
    })
}