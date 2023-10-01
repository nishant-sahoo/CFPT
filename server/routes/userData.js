const express = require("express");
const router = express.Router();

const userData = require("../controller/userData");

router.post("/rating", userData.getRating);
router.post("/problem", userData.getProblem);
router.post("/issolved", userData.isSolved);

module.exports = router;