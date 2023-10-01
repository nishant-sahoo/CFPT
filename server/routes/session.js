const express = require("express");
const router = express.Router();
const problemController = require("../controller/problemsetController");
const authController = require("../controller/authController");
const requireAuth = require("../middleware/requireAuth");
//controller functions

//Comment the below line to remove auth
// router.use(requireAuth);

//Create
router.post("/create", problemController.createEvent);
router.post("/create/:id", problemController.createProblemset);
router.post("/create/add/:id", problemController.addProblem);
router.post("/create/tag/:id", problemController.addTag);

//Fetch All
router.get("/create", problemController.getAllEvents);
router.get("/create/ps", problemController.getAllProblemSets);
router.get("/create/add", problemController.getAllProblems);
router.get("/create/tag", problemController.getAllTags);

//Fetch by ID
router.get("/create/:id", problemController.getEvent);
router.get("/create/ps/:id", problemController.getProblemSet);
router.get("/create/add/:id", problemController.getProblem);
router.get("/create/tag/:id", problemController.getTag);

//Update
router.patch("/create/:id", problemController.updateEvent);
router.patch("/create/ps/:id", problemController.updateProblemSet);
router.put("/create/tag/:id", problemController.updateTag);

//Delete
router.delete("/create/:id", problemController.deleteEvent);
router.delete("/create/ps/:id", problemController.deleteProblemSet);
router.delete("/create/add/:id", problemController.deleteProblem);
router.delete("/create/tag/:id", problemController.deleteTag);

module.exports = router;
