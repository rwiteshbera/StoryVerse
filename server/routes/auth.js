const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../keys");
const requireLogin = require("../middleware/requireLogin");

router.get("/", (req, res) => {
  res.send("Hello from HOME");
});

// Signup process
router.post("/signup", (req, res) => {
  try {
    // Check where the user has filled all the required fields
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
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

// Signin process
router.post("/signin", (req, res) => {
  // Check where the user has filled all the required fields
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Please fill all the fields" });
  }

  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "Invalid email or password" });
    }

    bcrypt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        if (doMatch) {
          const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET_KEY);
          const {name, _id} = savedUser;
          res.json({ token: token, name:name, userId: _id});
        } else {
          return res.status(422).json({ error: "Invalid email or password" });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  });
});

// Protected content
router.get("/protected", requireLogin, (req, res) => {
  res.send("Hello User from Protected");
});

module.exports = router;
