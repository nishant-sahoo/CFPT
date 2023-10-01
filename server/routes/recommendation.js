const express = require("express");
const router = express.Router();
const recommendationController = require("../controller/recommendationController");

router.post("/fetch", recommendationController.generateProblem);

module.exports = router;