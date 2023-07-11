const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

SENDER_EMAIL_PASS = process.env.SENDER_EMAIL_PASS;
SENDER_EMAIL = process.env.SENDER_EMAIL;
SERVER_BASE_URL = process.env.SERVER_BASE_URL;

// Forgot Password // Send a special Link to email
router.post("/forgot_password", (req, res) => {
  const { email } = req.body;

  User.findOne({ email: email })
    .then((savedUser) => {
      if (!savedUser) {
        res.json({ message: "Email is not registered yet." });
        return;
      }

      const secret = savedUser.password;

      const payload = {
        email: email,
        id: savedUser._id,
      };

      const token = jwt.sign(payload, secret, { expiresIn: "15m" }); // Special link will be expired after 15 min

      // This is the special link that will be used to reset user password
      const special_link = `${SERVER_BASE_URL}/reset_password/${savedUser._id}/${token}`;

      const message = {
        from: SENDER_EMAIL,
        to: email,
        subject: "Reset your password",
        text: `Reset Link (Valid for 15 minutes): ${special_link}`,
      };

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
            res.json({ message: "Internal Server Error" });
            return;
          } else {
            res.json({
              message: "Password reset link has been sent to your email.",
            });
            return;
          }
        });
    })
    .catch((e) => {
      return res.status(422).json({ message: e });
    });
});

// Redirect to forgot password page after reset link validation
router.get("/forgot_password/:id/:token", (req, res) => {
  let { id, token } = req.params;

  // Check id whether it exists or not
  // Link validation
  // Dot(.) and Hyphen(-) will not work in browser address path, hence we are replacing it with underscore(_dot_) and (_hyp_).

  User.findOne({ _id: id })
    .then((savedUser) => {
      if (!savedUser) {
        return res.send("User not found");
      }
      const secret = savedUser.password;

      try {
        const payload = jwt.verify(token, secret);
        token = token.replaceAll(".", "_dot_").replaceAll("-", "_hyp_");
        return res
          .status(301)
          .redirect(`http://localhost:3000/reset_password/${id}/${token}`);
      } catch (error) {
        return res.send("Invalid link");
      }
    })
    .catch((e) => {
      return res.status(422).json({ error: e });
    });
});

// If user click on forgot password button after giving new password
router.post("/forgot_password/:id/:token", (req, res) => {
  let { id, token } = req.params;
  let { newPassword } = req.body;
  // Check id whether it exists or not
  // Link validation
  // Dot(.) and Hyphen(-) will not work in browser address path, hence we are replacing it with underscore(_dot_) and (_hyp_).
  token = token.replaceAll("_dot_", ".").replaceAll("_hyp_", "-");

  User.findOne({ _id: id })
    .then((savedUser) => {
      if (!savedUser) {
        return res.json("Invalid reset link");
      }
      const secret = savedUser.password;

      try {
        const payload = jwt.verify(token, secret);
        // return res.json({payload: payload})

        bcrypt.hash(newPassword, 16).then((hashedPassword) => {
          User.findByIdAndUpdate(
            payload.id,
            { password: hashedPassword },
            { new: true },
            (err, result) => {
              if (err) {
                return res.status(422).json({ error: err });
              } else {
                return res.json({ message: "Password updated successfully." });
              }
            }
          );
        });
      } catch (e) {
        return res.send("Invalid link");
      }
    })
    .catch((e) => {
      return res.status(422).json({ error: e });
    });
});

module.exports = router;
