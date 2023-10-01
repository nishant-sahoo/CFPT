const express = require("express");
const router = express.Router();

const authController = require("../controller/authController");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", authController.me);
router.post("/send-email", authController.sendVerificationEmail);
router.get("/verify-email/:token", authController.verifyEmail);
router.post("/forgot-password", authController.forgotPassword);
router.post("/logout", authController.logout);

module.exports = router;
