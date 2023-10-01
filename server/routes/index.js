const express = require("express");
const router = express.Router();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(cookieParser());

app.use(router);

router.use("/auth", require("./auth"));
router.use("/help", require("./contactUs"));
router.use("/", require("./session"));
router.use("/archive", require("./archive"));
router.use("/user", require("./user"));
router.use("/announcement", require("./announcement"));
router.use("/potd", require("./potd"));
router.use("/recommendation", require("./recommendation"));
router.use("/standing", require("./standing"));
router.use("/problem", require("./problem"));
router.use("/userdata", require("./userData"));

//body-parser
router.use("/profile", require("./profile"));

module.exports = app;
