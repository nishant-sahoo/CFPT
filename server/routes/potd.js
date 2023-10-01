const express = require("express");
const router = express.Router();
const potdController = require("../controller/potdController");
const POTD = require("../Model/potd");

//Create
router.post("/create", potdController.createEvent);

//Fetch All
router.get("/", potdController.getAllEvents);

//Fetch by ID
router.get("/:id", potdController.getEvent);

//Update
router.patch("/:id", potdController.updateEvent);

//Delete
router.delete("/:id", potdController.deleteEvent);

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedItem = req.body;

    const existingItem = await POTD.findById(id);
    if (!existingItem) {
      return res.status(404).json({ error: "POTD item not found" });
    }

    // Update the fields of the existingItem with the updatedItem data
    existingItem.name = updatedItem.name;
    existingItem.publishedAt = updatedItem.publishedAt;
    existingItem.linkToProblem = updatedItem.linkToProblem;
    existingItem.solutionLink = updatedItem.solutionLink;

    const updatedPotdItem = await existingItem.save();

    res.status(200).json(updatedPotdItem);
  } catch (error) {
    console.log("Error updating POTD item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
