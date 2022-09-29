const express = require("express");
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
router.post('/settings/privacy&security/password', requireLogin, (req, res) => {
  return res.json({message: "SUCCESS"})
})

module.exports = router;
