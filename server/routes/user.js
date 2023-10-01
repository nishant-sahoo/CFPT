const express = require("express");
const router = express.Router();

const userController = require("../controller/userController");
const User = require("../Model/user");

router.get("/", userController);
router.get("/:id", userController);
router.delete("/:id", userController);
router.put("/:id", userController);

router.get("/all/", async (req, res) => {
  const user = await User.find({});
  res.status(200).json(user);
});

router.get("/:userID", async (req, res) => {
  try {
    const userID = req.params.userID;
    const data = await User.findById(userID);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//add problem to user
router.post("/addProblem", async (req, res) => {
  try {
    const userId = req.body.userId;
    const problemId = req.body.problemId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if problem exists in markedProblems
    const markedProblemIndex = user.markedProblems.indexOf(problemId);
    if (markedProblemIndex !== -1) {
      // Remove problem from markedProblems
      user.markedProblems.splice(markedProblemIndex, 1);
      await user.save();
    }

    if (user.solvedProblems.includes(problemId)) {
      return res
        .status(400)
        .json({ error: "Problem already exists in solvedProblems" });
    }

    user.solvedProblems.push(problemId);
    await user.save();

    res.status(200).json({ message: "Problem added to solvedProblems" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/checkProblem/", async (req, res) => {
  try {
    const userId = req.body.userId;
    const problemId = req.body.problemId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const problemExists = user.solvedProblems.includes(problemId);
    res.json({ exists: problemExists });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/rating", async (req, res) => {
  const id = req.body.id;
  const rating = req.body.rating;

  const updateOptions = {
    $set: { rating },
  };

  const user = await User.findOneAndUpdate({ _id: id }, updateOptions, {
    upsert: true,
    new: true,
  });
  res.json("DONE");
});

//add marked problem to user
router.post("/markProblem", async (req, res) => {
  try {
    const userId = req.body.userId;
    const problemId = req.body.problemId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.markedProblems.includes(problemId)) {
      return res
        .status(400)
        .json({ error: "Problem already exists in markedProblems" });
    }

    user.markedProblems.push(problemId);
    await user.save();

    res.status(200).json({ message: "Problem added to markedProblems" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/unMarkProblems", async (req, res) => {
  try {
    const userId = req.body.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.markedProblems = [];
    await user.save();

    res.status(200).json({ message: "unMarked Everything" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
