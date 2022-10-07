const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const User = mongoose.model("User");
const requireLogin = require("../middleware/requireLogin");

// Change your name and gender
router.post("/settings/edit&profile/name&gender", requireLogin, (req, res) => {
  const { name, gender } = req.body;
  if (name || gender) {
    User.findByIdAndUpdate(
      req.user._id,
      { name, gender },
      { new: true },
      (err, result) => {
        if (err) {
          return res.status(422).json({ error: err });
        } else {
          return res.json({ message: "name or gender updated" });
        }
      }
    );
  } else {
    return res.json({ message: "Input cannot be empty" });
  }
});

// Check your username
router.post("/settings/edit&profile/username", requireLogin, (req, res) => {
  const { username } = req.body;

  if (username) {
    if (username == req.user.username)
      return res.json({ message: "No changes found" });
    // Check if username is already used or not
    User.findOne({ username: username }).then((savedUser) => {
      if (savedUser) {
        return res.json({ message: 1 });
      } else {
        // if not then update username
        User.findByIdAndUpdate(
          req.user._id,
          { username: username },
          { new: true },
          (err, result) => {
            if (err) {
              return res.status(422).json({ error: err });
            } else {
              return res.json({ message: "username updated" });
            }
          }
        );
      }
    });
  } else {
    return res.json({ message: "Input cannot be empty" });
  }
});

// Change your email
router.post("/settings/edit&profile/email", requireLogin, (req, res) => {
  const { email } = req.body;
  if (email) {
    // You are providing same email
    if (email === req.user.email)
      return res.json({ message: "No changes found" });

    // Check if email is already used or not
    User.findOne({ email: email }).then((savedUser) => {
      if (savedUser) {
        return res.json({ message: 1 });
      } else {
        // if not then update it
        User.findByIdAndUpdate(
          req.user._id,
          { email: email },
          { new: true },
          (err, result) => {
            if (err) {
              return res.status(422).json({ error: err });
            } else {
              return res.json({ message: "email updated" });
            }
          }
        );
      }
    });
  } else {
    return res.json({ message: "Input cannot be empty" });
  }
});

// Change password
router.post("/settings/privacy&security/password", requireLogin, (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(402).json({ message: "Field cannot be empty." });
  } else {
    // Old password and new password should not be same
    if (oldPassword !== newPassword) {
      bcrypt
        .compare(oldPassword, req.user.password)
        .then((doMatch) => {
          if (doMatch) {
            // If you have provided correct old password, then only you can add new password
            bcrypt.hash(newPassword, 16).then((hashedPassword) => {
              User.findByIdAndUpdate(
                req.user._id,
                { password: hashedPassword },
                { new: true },
                (err, result) => {
                  if (err) {
                    return res.status(422).json({ error: err });
                  } else {
                    return res.json({
                      message: "Password updated successfully.",
                    });
                  }
                }
              );
            });
          } else {
            return res.json({ message: "Wrong old password" });
          }
        })
        .catch((e) => {
          return console.log(e);
        });
    } else {
      return res.status(402).json({
        message: "Old password should not be same with new password.",
      });
    }
  }
});

// Temporarily Deactivate Account
router.post("/settings/manage&account/deactivate", requireLogin, (req, res) => {
  const { password } = req.body;

  bcrypt
    .compare(password, req.user.password)
    .then((doMatch) => {
      if (doMatch) {
        User.findByIdAndUpdate(
          req.user._id,
          { isDeactivated: true },
          { new: true },
          (err, result) => {
            if (err) {
              return res
                .status(422)
                .json({ message: "Unable to deactivate your account" });
            } else {
              return res.json({
                message: "Your account is temporarily deactivated.",
              });
            }
          }
        );
      }
    })
    .catch((e) => {
      return res.status(422).json({ error: e });
    });
});

// Delete Account Permanently
router.post("/settings/manage&account/delete", requireLogin, (req, res) => {
  const { password } = req.body;
  bcrypt
    .compare(password, req.user.password)
    .then((doMatch) => {
      if (doMatch) {
        User.findByIdAndDelete(req.user._id, function (err, docs) {
          if (!err) {
            return res.json({ message: "Your account is permanently closed." });
          } else {
            return res
              .status(422)
              .json({ message: "Unable to delete your account" });
          }
        });
      }
    })
    .catch((e) => {
      return res.status(422).json({ error: e });
    });
});

module.exports = router;
