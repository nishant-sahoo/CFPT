const express = require("express");
const router = express.Router();
const Problem = require("../Model/problem");

router.get("/", async (req, res) => {
  const problem = await Problem.find({});
  res.status(200).json(problem);
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const problems = await Problem.find({ _id: id });
    res.json(problems);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//add user to peopleSolved
router.post("/addSolved", async (req, res) => {
  try {
    const userId = req.body.userId;
    const problemId = req.body.problemId;

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    if (problem.peopleSolved.includes(userId)) {
      return res
        .status(400)
        .json({ error: "User already exists in peopleSolved" });
    }

    problem.peopleSolved.push(userId);
    await problem.save();

    res.status(200).json({ message: "User added to peopleSolved" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//flip user in peopleMarked => if present, remove it. else add it
router.post("/flipMarked", async (req, res) => {
  try {
    const userId = req.body.userId;
    const problemId = req.body.problemId;

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    const userIndex = problem.peopleMarked.indexOf(userId);
    if (userIndex !== -1) {
      // User exists in peopleMarked, remove them
      problem.peopleMarked.splice(userIndex, 1);
    } else {
      // User doesn't exist in peopleMarked, add them
      problem.peopleMarked.push(userId);
    }

    await problem.save();
    return res.status(200).json(problem);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
