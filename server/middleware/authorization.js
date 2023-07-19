const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const User = mongoose.model("User");

const secretKey = process.env.JWT_SECRET;

module.exports = (request, response, next) => {
  try {
    const authorization = request.cookies.authorization;

    // authorization === Bearer JSON_WEBTOKEN
    if (!authorization) {
      return response.status(401).json({ error: "Authorization failed" });
    }

    const token = authorization.split(" ")[1];

    jwt.verify(token, secretKey, (error, payload) => {
      if (error) {
        response.status(401).json({ isAuthorized: false, message: error });
        return;
      }
      request.user = payload;
      next();
    });
  } catch (error) {
    return response.status(401).json({ error: "Authorization failed" });
  }
};
