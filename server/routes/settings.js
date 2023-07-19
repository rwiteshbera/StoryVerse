const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = express.Router();
const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const User = mongoose.model("User");
const requireLogin = require("../middleware/authorization");

// Change your name and gender
router.post("/settings/edit&profile/name&gender", requireLogin, (request, response) => {
  const { name, gender } = request.body;
  if (name || gender) {
    User.findByIdAndUpdate(
      request.user._id,
      { name, gender },
      { new: true },
      (err, result) => {
        if (err) {
          return response.status(422).json({ error: err });
        } else {
          return response.json({ message: "name or gender updated" });
        }
      }
    );
  } else {
    return response.json({ message: "Input cannot be empty" });
  }
});

// Check your username
router.post("/settings/edit&profile/username", requireLogin, (request, response) => {
  const { username } = request.body;

  if (username) {
    if (username == request.user.username)
      return response.json({ message: "No changes found" });
    // Check if username is already used or not
    User.findOne({ username: username }).then((savedUser) => {
      if (savedUser) {
        return response.json({ message: 1 });
      } else {
        // if not then update username
        User.findByIdAndUpdate(
          request.user._id,
          { username: username },
          { new: true },
          (err, result) => {
            if (err) {
              return response.status(422).json({ error: err });
            } else {
              return response.json({ message: "username updated" });
            }
          }
        );
      }
    });
  } else {
    return response.json({ message: "Input cannot be empty" });
  }
});

// Change your email
router.post("/settings/edit&profile/email", requireLogin, (request, response) => {
  const { email } = request.body;
  if (email) {
    // You are providing same email
    if (email === request.user.email)
      return response.json({ message: "No changes found" });

    // Check if email is already used or not
    User.findOne({ email: email }).then((savedUser) => {
      if (savedUser) {
        return response.json({ message: 1 });
      } else {
        // if not then update it
        User.findByIdAndUpdate(
          request.user._id,
          { email: email },
          { new: true },
          (err, result) => {
            if (err) {
              return response.status(422).json({ error: err });
            } else {
              return response.json({ message: "email updated" });
            }
          }
        );
      }
    });
  } else {
    return response.json({ message: "Input cannot be empty" });
  }
});

// Change password
router.post("/settings/privacy&security/password", requireLogin, (request, response) => {
  const { oldPassword, newPassword } = request.body;

  if (!oldPassword || !newPassword) {
    return response.status(402).json({ message: "Field cannot be empty." });
  } else {
    // Old password and new password should not be same
    if (oldPassword !== newPassword) {
      bcrypt
        .compare(oldPassword, request.user.password)
        .then((doMatch) => {
          if (doMatch) {
            // If you have provided correct old password, then only you can add new password
            bcrypt.hash(newPassword, 16).then((hashedPassword) => {
              User.findByIdAndUpdate(
                request.user._id,
                { password: hashedPassword },
                { new: true },
                (err, savedUser) => {
                  if (err) {
                    return response.status(422).json({ error: err });
                  } else {
                    const token = jwt.sign(
                      { _id: savedUser._id },
                      savedUser.password
                    );
                    return response.json({
                      token,
                      message: "Password updated successfully.",
                    });
                  }
                }
              );
            });
          } else {
            return response.json({ message: "Wrong old password" });
          }
        })
        .catch((e) => {
          return console.log(e);
        });
    } else {
      return response.status(402).json({
        message: "Old password should not be same with new password.",
      });
    }
  }
});

// Temporarily Deactivate Account
router.post("/settings/manage&account/deactivate", requireLogin, (request, response) => {
  const { password } = request.body;

  bcrypt
    .compare(password, request.user.password)
    .then((doMatch) => {
      if (doMatch) {
        User.findByIdAndUpdate(
          request.user._id,
          { isDeactivated: true },
          { new: true },
          (err, result) => {
            if (err) {
              return response
                .status(422)
                .json({ message: "Unable to deactivate your account" });
            } else {
              return response.json({
                message: "Your account is temporarily deactivated.",
              });
            }
          }
        );
      }
    })
    .catch((e) => {
      return response.status(422).json({ error: e });
    });
});

// Delete Account Permanently
router.post("/settings/manage&account/delete", requireLogin, (request, response) => {
  const { password } = request.body;
  bcrypt
    .compare(password, request.user.password)
    .then((doMatch) => {
      if (doMatch) {
        User.findByIdAndDelete(request.user._id, function (err, docs) {
          if (!err) {
            return response.json({ message: "Your account is permanently closed." });
          } else {
            return response
              .status(422)
              .json({ message: "Unable to delete your account" });
          }
        });
      }
    })
    .catch((e) => {
      return response.status(422).json({ error: e });
    });
});

module.exports = router;
