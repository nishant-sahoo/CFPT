const express = require("express");
const {
  getUser,
  updateUserInfo,
  updateUserRatings,
  deleteUser,
} = require("../controller/profile");
const router = express.Router();

router.get("/:id", getUser);
router.post("/:id", updateUserRatings);
router.post("/:id/edit", updateUserInfo);
router.delete("/:id/delete", deleteUser);

module.exports = router;
