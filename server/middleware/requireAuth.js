const jwt = require("jsonwebtoken");
const User = require("../Model/user");
const requireAuth = (req, res, next) => {
  // verify authentication
  const { authorization } = req.headers;
  //   const authorization = req.cookies.qwerty;
  console.log(req.headers);

  if (!authorization)
    return res.status(401).send({ auth: false, message: "No token provided." });
  const token = authorization.split(" ")[1];
  jwt.verify(
    token,
    process.env.JWT_SECRET_KEY || "secret",
    function (err, decoded) {
      if (err)
        return res
          .status(500)
          .send({ auth: false, message: "Failed to authenticate token." });

      User.findById(decoded.id, { password: 0 }, function (err, user) {
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
module.exports = requireAuth;
