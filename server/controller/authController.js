const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../Model/user");

const iterations = require("../Utils/index").ITERATIONS;
const adminList = require("../Utils/index").ADMINLIST;
const Roles = require("../Utils/index").ROLES;
const mailContent = require("../Utils/index").SENDEMAIL;
const sendEmail = require("../Utils/sendEmail");

module.exports.register = async (req, res) => {
  const hashedPassword = bcrypt.hashSync(req.body.password, iterations);
  const roles = adminList.includes(req.body.email) ? Roles.ADMIN : Roles.USER;

  User.findOne({ email: req.body.email }, async function (err, user) {
    if (user) return res.status(402).send({ data: "User already Exists" });

    User.create(
      {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        role: roles,
      },
      function (err, user) {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .send({ data: "There was a problem registering the user." });
        }

        // create a token
        // const token = jwt.sign(
        //   { id: user._id, role: user.role },
        //   process.env.JWT_SECRET_KEY || "secret",
        //   {
        //     expiresIn: 86400, // expires in 24 hours
        //   }
        // );
        // res.cookie("qwerty", token, {
        //   httpOnly: true,
        //   secure: process.env.NODE_ENV === "production",
        //   maxAge: 3600000,
        // });

        res.status(200).send({ id: user._id, role: user.role });
      }
    );
  });
};
module.exports.authorization = async (req, res, next) => {
  const token = req.cookies.qwerty;
  if (!token)
    return res.status(401).send({ auth: false, message: "No token provided." });

  jwt.verify(
    token,
    process.env.JWT_SECRET_KEY || "secret",
    function (err, decoded) {
      if (err)
        return res
          .status(500)
          .send({ auth: false, message: "Failed to authenticate token." });

      User.findById(decoded.id, function (err, user) {
        if (err)
          return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        req.userId = user._id;
        req.role = user.role;
        return next();
      });
    }
  );
};
module.exports.me = async (req, res) => {
  const token = req.cookies.qwerty;
  if (!token)
    return res.status(401).send({ auth: false, message: "No token provided." });

  jwt.verify(
    token,
    process.env.JWT_SECRET_KEY || "secret",
    function (err, decoded) {
      if (err)
        return res
          .status(500)
          .send({ auth: false, message: "Failed to authenticate token." });

      User.findById(decoded.id, function (err, user) {
        if (err)
          return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");

        res.status(200).send(user);
      });
    }
  );
};

module.exports.login = async (req, res) => {
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) return res.status(500).send({ data: "Error on the server." });
    if (!user) return res.status(404).send({ data: "No user found." });
    console.log(req.headers["x-access-token"]);
    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!passwordIsValid)
      return res.status(401).send({
        auth: false,
        token: null,
        data: "Please Enter Correct Details",
      });

    if (!user.verified) {
      return res.status(401).send({
        auth: false,
        token: null,
        data: "Verify Your Email address",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET_KEY || "secret",
      {
        expiresIn: 86400, // expires in 24 hours
      }
    );
    res.cookie("qwerty", token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
      sameSite: true,
    });
    console.log(req.headers);

    res.status(200).send({
      auth: true,
      token: token,
      id: user._id,
      role: user.role,
      jwtToken: token,
    });
  });
};

// module.exports.verify = async (req, res) => {
//   let token = req.headers["x-access-token"];
//   // console.log(token);
//   if (!token) {
//     return res.status(403).send({
//       message: "No token provided!",
//     });
//   }
//   jwt.verify(token, process.env.JWT_SECRET_KEY || "secret", (err, decoded) => {
//     if (err) {
//       return res.status(401).send({
//         message: "Unauthorized!",
//         decodedId: null,
//       });
//     }
//     return res.status(200).send({
//       message: "Authorised!",
//       decodedId: decoded,
//     });
//   });
// };

module.exports.sendVerificationEmail = async (req, res) => {
  const { email, purpose } = req.body;
  User.findOne({ email: req.body.email }, async function (err, user) {
    if (err) return res.status(500).send({ data: "Error on the server." });
    if (!user) return res.status(404).send({ data: "No user found." });

    const token = jwt.sign(
      { id: user._id, email: email },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: "10m", // Token expiration time
      }
    );
    // Send the verification email to the user's email address with the token
    const subject = mailContent(token)[purpose].subject,
      content = mailContent(token)[purpose].content;
    await sendEmail(email, token, subject, content);
    res.status(200).send({
      success: true,
      data: "Email Sent. Check Your Inbox!",
    });
  });
};

module.exports.verifyEmail = async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    // Update the user's email verification status in the database

    User.findByIdAndUpdate(
      decoded.id,
      { verified: true },
      function (err, user) {
        if (err)
          return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("Not an User. Register Please!");

        return res.status(200).send("Email Verified"); // Redirect to the email verification success page
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(404).send("Verification Failed"); // Redirect to the email verification failure page
  }
};

module.exports.forgotPassword = async (req, res) => {
  const { token, password } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    // Update the user's email verification status in the database
    const hashedPassword = bcrypt.hashSync(password, iterations);

    User.findByIdAndUpdate(
      decoded.id,
      { password: hashedPassword },
      function (err, user) {
        if (err)
          return res
            .status(500)
            .send({ data: "There was a problem updating the password." });
        if (!user)
          return res
            .status(404)
            .send({ data: "Not an User. Register Please!" });

        return res.status(200).send({ data: "Password Changed" }); // Redirect to the email verification success page
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(404).send({ data: "Failed to change password" }); // Redirect to the email verification failure page
  }
};

module.exports.logout = async (req, res) => {
  let randomNumberToAppend = toString(Math.floor(Math.random() * 1000 + 1));
  let randomIndex = Math.floor(Math.random() * 10 + 1);
  let hashedRandomNumberToAppend = await bcrypt.hash(randomNumberToAppend, 10);

  // now just concat the hashed random number to the end of the token
  req.token = req.token + hashedRandomNumberToAppend;
  return res.status(200).clearCookie("qwerty").json("logout");
};
