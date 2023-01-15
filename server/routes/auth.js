const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const uaParser = require("ua-parser-js");
const nodemailer = require("nodemailer");

const dotenv = require("dotenv").config();

const requireLogin = require("../middleware/requireLogin");

SENDER_EMAIL_PASS = process.env.SENDER_EMAIL_PASS;
SENDER_EMAIL = process.env.SENDER_EMAIL;
SERVER_BASE_URL = process.env.SERVER_BASE_URL;

router.get("/", (req, res) => {
  res.send("Hello from HOME");
});

// Signup process
router.post("/signup", (req, res) => {
  try {
    // Check where the user has filled all the required fields
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password) {
      return res.status(422).json({ error: "Please fill all the fields" });
    }

    // Check if the user is already exists with the same email
    User.findOne({ email: email })
      .then((savedUser) => {
        if (savedUser) {
          return res
            .status(422)
            .json({ error: "User already exists with that email" });
        }

        // Create new user and store it in the database
        // Hash the password before storing it in the database
        bcrypt
          .hash(password, 16)
          .then((hashedPassword) => {
            const newUser = new User({
              email: email,
              password: hashedPassword,
              name: name,
              username: username,
            });

            newUser
              .save()
              .then((user) => {
                res.json({ message: "Account created successfully" });
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((e) => {
            console.log(e);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log("ERROR : " + error);
  }
});

// Signin process // Login Process
router.post("/signin", (req, res) => {
  // Check where the user has filled all the required fields
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Please fill all the fields" });
  }

  User.findOne({ email: email })
    .then((savedUser) => {
      if (!savedUser) {
        return res.status(422).json({ error: "Invalid email" });
      }
      const { name, _id, following, followers, isDeactivated } = savedUser;
      bcrypt
        .compare(password, savedUser.password)
        .then((doMatch) => {
          if (doMatch) {
            const token = jwt.sign({ _id: savedUser._id }, savedUser.password);
            // Check whether the account is deactivated or not
            if (!isDeactivated) {
              // Save Loggedin activity
              User.findByIdAndUpdate(
                savedUser._id,
                {
                  // Saving user device os type
                  $push: {
                    loggedInActivity: uaParser(
                      req.headers["sec-ch-ua-platform"]
                    ).ua,
                  },
                },
                {
                  new: true,
                }
              ).exec((err, result) => {
                if (err) {
                  return res.status(422).json({ error: err });
                } else {
                  res.json({
                    token: token,
                    name: name,
                    userId: _id,
                    following: following.length,
                    followers: followers.length,
                    isDeactivated: isDeactivated,
                  });
                }
              });
            } else {
              // If deactivated, activate it
              User.findByIdAndUpdate(
                savedUser._id,
                { isDeactivated: false },
                { new: true },
                (err, result) => {
                  if (err) {
                    return res.status(422).json({
                      message:
                        "Unable to activate your account. Try again later.",
                    });
                  } else {
                    return res.json({
                      message:
                        "Your temporarily deactivated account has been activated. Login once again to use.",
                    });
                  }
                }
              );
            }
          } else {
            return res.status(422).json({ error: "Invalid password" });
          }
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    })
    .catch((err) => {
      return res.status(422).json({ error: err });
    });
});

// Reset Password // Send a special Link to email
router.post("/reset_password", (req, res) => {
  const { email } = req.body;

  User.findOne({ email: email })
    .then((savedUser) => {
      if (!savedUser) {
        res.json({message : "Email is not registered yet."});
        return
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
            res.json({message : "Internal Server Error"});
            return
          } else {
            res.json({message : "Password reset link has been sent to your email."});
            return
          }
        });
    })
    .catch((e) => {
      return res.status(422).json({ message: e });
    });
});

// Redirect to reset password page after reset link validation
router.get("/reset_password/:id/:token", (req, res) => {
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

// If user click on reset button after giving new password
router.post("/reset_password/:id/:token", (req, res) => {
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
