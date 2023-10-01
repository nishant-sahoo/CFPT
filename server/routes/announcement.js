const express = require("express");
const router = express.Router();
const announcementController = require("../controller/announcementController");

router.post("/create", announcementController.createAnnouncement);
router.get("/fetch", announcementController.getAnnouncements);

module.exports = router;