const express = require("express");
const router = express.Router();
const standingController = require("../controller/standingController");
const Standing = require("../Model/standing");

//Create
router.post("/event/create", standingController.createStanding);

//Get Standing by eventID
router.get("/event/find/:id", standingController.findStanding);

//Fetch All
router.get("/event/", standingController.getAllStandings);

//Fetch by ID
router.get("/event/:id", standingController.getStanding);

// //Update
// router.patch("/event/:id", standingController.updateStanding);

// //Delete
// router.delete("/:id", standingController.deleteStanding);

//increase solves
router.patch("/event/:eventID/:userID", async (req, res) => {
  const eventID = req.params.eventID;
  const userID = req.params.userID;

  const updatedStanding = await Standing.findOneAndUpdate(
    { event: eventID, "userinfo.user": userID },
    { $inc: { "userinfo.$.solves": 1 } },
    { new: true }
  );

  if (updatedStanding) {
    res.status(200).send("Updated Standings");
  } else {
    res.status(404).send("Cannot update standings");
  }
});

module.exports = router;