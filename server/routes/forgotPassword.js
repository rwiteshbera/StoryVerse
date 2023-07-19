const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const {
  generateHashpassword,
  validateHashpassword,
} = require("../utils/bcrypt");

const SENDER_EMAIL_PASS = process.env.SENDER_EMAIL_PASS;
const SENDER_EMAIL = process.env.SENDER_EMAIL;
const SECRET_KEY = process.env.JWT_SECRET;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;

// Forgot Password // Send a special token to email
router.post("/v1/forgot_password", async (request, response) => {
  const { email } = request.body;

  if (!email) {
    return response.status(422).json({ message: "no email found" });
  }

  try {
    // Find the user data using email
    const savedUser = await User.findOne({ email: email });

    // Check if user exists or not
    if (!savedUser) {
      return response.status(422).json({ message: "no user found with this email" });
    }

    // Create a user payload
    const payload = {
      id: savedUser._id,
      email: savedUser.email,
      username: savedUser.username,
    };

    // Generate a special JWT
    const specialToken = jwt.sign(payload, SECRET_KEY, { expiresIn: "15m" });

    // Createa a reset link
    const resetLink = `${CLIENT_ORIGIN}/passwordReset?token=${specialToken}&username=${savedUser.username}`;

    // Create a email
    const message = {
      from: SENDER_EMAIL,
      to: email,
      subject: "Reset your password",
      text: `Reset Token (Valid for 15 minutes): \n ${resetLink}`,
    };

    // Send the email to the user
    nodemailer
      .createTransport({
        service: "gmail",
        auth: {
          user: SENDER_EMAIL,
          pass: SENDER_EMAIL_PASS,
        },
        port: 465,
        host: "smtp.gmail.com",
      })
      .sendMail(message, (err) => {
        if (err) {
          return response.status(500).json({ message: "Internal Server Error" });
        } else {
          console.log(specialToken);
          return response.status(200).json({
            message: "Password reset link has been sent to your email.",
          });
        }
      });
  } catch (error) {
    return response.status(500).json({ errror: error });
  }
});

// Reset link validation
router.get("/v1/forgot_password", async (request, response) => {
  let { token, username } = request.query;

  try {
    const savedUser = await User.findOne({ username: username });

    if (!savedUser) {
      return response.status(422).json({ error: "invalid link" });
    }

    jwt.verify(token, SECRET_KEY, (err, payload) => {
      if (err) {
        return response.status(422).json({ error: "token has been expired" });
      }

      if (payload.username !== username) {
        return response.status(422).json({ error: "invalid link" });
      }

      generateHashpassword(payload.id)
        .then((reset_id) => {
          response.cookie("reset_id", reset_id, {
            secure: true,
            httpOnly: true,
            expiresIn: 1000 * 60 * 5, // 5 Minutes
          });

          response.status(200).json({ username, status: "ok" });
        })
        .catch((err) => {
          return response.status(422).json({ error: err });
        });
    });
  } catch (error) {
    return response.status(422).json({ error: error });
  }
});

// If user click on forgot password button after giving new password
router.post("/v1/reset_password", async (request, response) => {
  let reset_id = request.cookies.reset_id;

  let { username, newPassword } = request.body;

  if (!reset_id || !username || !newPassword) {
    return response.status(422).json({ error: "unable to update password" });
  }

  try {
    const savedUser = await User.findOne({ username: username });
    if (!savedUser) {
      return response.status(422).json({ error: "unable to update password" });
    }

    const isValidResetId = await validateHashpassword(
      savedUser._id.valueOf(),
      reset_id
    );

    if (!isValidResetId) {
      return response.status(422).json({ error: "unable to update password" });
    }

    // Hash the password
    let hashedPassword = await generateHashpassword(newPassword);

    if (!hashedPassword) {
      return response.status(500).json({
        error: "unable to update password",
      });
    }

    const result = await User.findByIdAndUpdate(
      { _id: savedUser._id },
      { password: hashedPassword }
    );

    if (!result) {
      return response.status(422).json({ error: "unable to update password" });
    }
    response.clearCookie("reset_id");
    return response.status(200).json({ message: "password updated successfully" });
  } catch (error) {
    return response.status(422).json({ error: "unable to update password" });
  }
});

module.exports = router;
