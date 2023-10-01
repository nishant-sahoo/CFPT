const express = require("express");
const router = express.Router();
const app = express();
const sessionController = require("../controller/sessionController");
const ProblemSet = require("../Model/problemSet");
const Event = require("../Model/event");

//Create
router.post("/create", sessionController.createEvent);

//Fetch All
router.get("/", sessionController.getAllEvents);

//Fetch by ID
router.get("/:id", sessionController.getEvent);

//Update
router.patch("/:id", sessionController.updateEvent);

//Delete
router.delete("/:id", sessionController.deleteEvent);

//get all problems
router.get("/:eventId/problems", async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const allPS = event.allProblems;

    const pp = await Promise.all(
      allPS.map(async (ps) => {
        const ps1 = await ProblemSet.findById(ps);
        return ps1.problems;
      })
    );
    const problems = pp.flat();

    res.json(problems);
    //   const problems = event.allProblems.flatMap((problemset) => problemset.problems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
