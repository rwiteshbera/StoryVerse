const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    // authorization === Bearer JSON_WEBTOKEN
    if (!authorization) {
      console.log("Authorization Failed");
      return res.status(401).json({ error: "Authorization failed" });
    }

    const token = req.headers.authorization.split(" ")[1];

    const { _id } = jwt_decode(token);

    User.findById(_id).then((userData) => {
      jwt.verify(token, userData.password, (err) => {
        if (err) {
          return res.status(401).json({
            error: "You must be logged in",
            err,
            token,
          });
        }
        req.user = userData;
        next();
      });
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Authorization failed" });
  }
};
