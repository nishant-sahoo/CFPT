const mongoose = require("mongoose");
const Standing = require("../Model/standing");
const Event = require("../Model/event");

//create
module.exports.createStanding = async (req, res) => {
  const { event, userinfo, problems } = req.body;

  try {
    const standing = await Standing.create({
      event,
      userinfo,
      problems,
    });

    // const change = await Event.findOneAndUpdate(
    //   {_id : event},
    //   {
    //     "standing": standing
    //   }
    // )
    res.status(200).json(standing);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//get all
module.exports.getAllStandings = async (req, res) => {
  const standing = await Standing.find({}).populate("event");
  res.status(200).json(standing);
};

// // Get standings for a specific event
module.exports.findStanding = async (req, res) => {
  const {id} = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such event" });
  }
  
  const event = await Event.findById(id).populate('standing');

  const sid = event.standing;
  
  if (!mongoose.Types.ObjectId.isValid(sid)) {
    return res.status(404).json({ error: "No such standing" });
  }
  const standing = await Standing.findById(sid);

  res.status(200).json(standing);

};

// //increase solves
// router.patch("/event/:eventID/:userID", async (req, res) => {
//   const eventID = req.params.eventID;
//   const userID = req.params.userID;

//   const updatedStanding = await Standing.findOneAndUpdate(
//     { event: eventID, "userinfo.user": userID },
//     { $inc: { "userinfo.$.solves": 1 } },
//     { new: true }
//   );

//   if (updatedStanding) {
//     res.status(200).send("Updated Standings");
//   } else {
//     res.status(404).send("Cannot update standings");
//   }
// });


//get by id
module.exports.getStanding = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such standing" });
  }

  const standing = await Standing.findById(id);
  if (!standing) {
    return res.status(404).json({ error: "No such standing" });
  }
  res.status(200).json(standing);
};

// //update
// module.exports.updateStanding = async (req, res) => {
//   const { id } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(400).json({ error: "No such event" });
//   }

//   const standing = await Standing.findOneAndUpdate(
//     { _id: id },
//     {
//       ...req.body,
//     }
//   );

//   if (!standing) {
//     return res.status(400).json({ error: "No such standing" });
//   }
//   res.status(200).json(standing);
// };

// //delete
// module.exports.deleteStanding = async (req, res) => {
//   const { id } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(400).json({ error: "No such event" });
//   }

//   const event = await Standing.findOneAndDelete({ _id: id });
//   if (!event) {
//     return res.status(400).json({ error: "No such event" });
//   }
//   res.status(200).json(event);
// };
