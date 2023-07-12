const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const User = mongoose.model("User");

const secretKey = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
  try {
    const authorization = req.cookies.authorization;

    // authorization === Bearer JSON_WEBTOKEN
    if (!authorization) {
      return res.status(401).json({ error: "Authorization failed" });
    }

    const token = authorization.split(" ")[1];

    jwt.verify(token, secretKey, (error, payload) => {
      if (error) {
        res.status(401).json({ message: error });
        return;
      }
      req.user = payload;
      next();
    });
  } catch (error) {
    return res.status(401).json({ error: "Authorization failed" });
  }
};
