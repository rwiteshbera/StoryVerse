const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
const uaParser = require("ua-parser-js");
const emailValidator = require("email-validator");

const {
  generateHashpassword,
  validateHashpassword,
} = require("../utils/bcrypt");

SENDER_EMAIL_PASS = process.env.SENDER_EMAIL_PASS;
SENDER_EMAIL = process.env.SENDER_EMAIL;
SERVER_BASE_URL = process.env.SERVER_BASE_URL;

router.get("/", (req, res) => {
  res.send("Hello from PixBy");
});

// Signup process
router.post("/v1/signup", async (req, res) => {
  // Check where the user has filled all the required fields
  const { name, username, email, password } = req.body;
  if (!name || !username || !email || !password) {
    return res.status(422).json({ error: "Please fill all the fields" });
  }

  // Validate Email
  if (!emailValidator.validate(email)) {
    return res.status(400).json({ message: "Please provide valid email" });
  }

  // Hash the password
  let hashedPassword = await generateHashpassword(password);

  if (!hashedPassword) {
    return res.status(500).json({
      message: `Please try again`,
    });
  }

  // Check if the user is already exists with the same email or username
  User.findOne({ $or: [{ email: email }, { username: username }] })
    .then((savedUser) => {
      if (savedUser) {
        if (savedUser.email === email) {
          return res
            .status(422)
            .json({ message: `User already exists with email: ${email}` });
        } else if (savedUser.username === username) {
          return res.status(422).json({
            message: `User already exists with username: ${username}`,
          });
        }
      }

      const newUser = new User({
        name: name,
        username: username,
        email: email,
        password: hashedPassword,
      });

      newUser
        .save()
        .then((user) => {
          res.status(200).json({ message: "Account created successfully" });
        })
        .catch((err) => {
          res.status(422).json({ message: err });
        });
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

// Login process // Login Process
// [Email or Username + Password]
router.post("/v1/login", async (req, res) => {
  const { email, password, username } = req.body;

  // Fetch user platform details
  const userPlatform = uaParser(req.headers["sec-ch-ua-platform"]).ua;

  // Check where the user has filled all the required fields [Email or username & password]
  if ((!email && !username) || !password) {
    return res.status(422).json({ error: "Please fill all the fields" });
  }

  // Validate email id
  if (email) {
    if (!emailValidator.validate(email)) {
      return res.status(400).json({ message: "Please provide valid email" });
    }
  }

  // Check if user exists with this email or username
  const savedUser = await User.findOne({
    $or: [{ email: email }, { username: username }],
  });

  // If user doesn't exists, send a response
  if (!savedUser) {
    return res.status(422).json({ error: "Invalid credentials" });
  }

  // Validate Password
  const isValidPassword = await validateHashpassword(
    password,
    savedUser.password
  );

  // If password is not correct
  if (!isValidPassword) {
    return res.status(422).json({ error: "Invalid credentials" });
  }

  // If password is valid, sign a jwt token
  const token = jwt.sign(
    {
      _id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
    },
    process.env.JWT_SECRET
  );

  // Check whether the account is deactivated or not
  if (savedUser.isDeactivated) {
    // If deactivated, activate it
    User.findByIdAndUpdate(
      savedUser._id,
      { isDeactivated: false },
      { new: true },
      (err, result) => {
        if (err) {
          return res.status(422).json({
            message: "Unable to activate your account. Try again later.",
          });
        } else {
          return res.status(200).json({
            message:
              "Your account has been activated. Login once again to use.",
          });
        }
      }
    );
  }

  // Login Process
  // Save Loggedin activity
  try {
    const result = await User.findByIdAndUpdate(
      savedUser._id,
      {
        // Saving user device os type
        $push: {
          logInActivity: userPlatform || "Unknown",
        },
      },
      {
        new: true,
      }
    );
  } catch (err) {
    return res.status(500).json({
      message: "Unable to save your activity. Try again later.",
    });
  }

  // Cookie expiry
  const expiryDays = 1000 * 60 * 60 * 24 * 7; // 7 days

  // Store JWT token in cookie
  res.cookie("authorization", `Bearer ${token}`, {
    secure: true,
    httpOnly: true,
    maxAge: expiryDays,
  });

  // Store username in cookie
  res.cookie("username", savedUser.username, {
    secure: true,
    httpOnly: true,
    maxAge: expiryDays,
  });

  // Send response
  return res.status(200).json({
    name: savedUser.name,
    username: savedUser.name,
    email: savedUser.email,
    profilePhoto: savedUser.profilePhoto,
    gender: savedUser.gender,
    following: savedUser.following.length,
    followers: savedUser.followers.length,
    isDeactivated: savedUser.isDeactivated,
  });
});

module.exports = router;
