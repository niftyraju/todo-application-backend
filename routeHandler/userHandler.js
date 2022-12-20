const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../schemas/userSchema");
const bcrypt = require("bcrypt");

// signup
router.post("/signup", async (req, res) => {
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      name: req.body.name,
      userName: req.body.userName,
      password: hashPassword,
    });
    await newUser.save();
    res.status(500).json({
      message: "Signup was successful!",
    });
  } catch {
    res.status(500).json({
      message: "Signup failed!",
    });
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ userName: req.body.userName }).select(
      "+password"
    );
    if (user) {
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (isValidPassword) {
        // generate token
        const token = jwt.sign(
          {
            userName: req.body.userName,
            userId: user._id,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );
        res.status(200).json({
          access_token: token,
          message: "Login successful",
        });
      } else {
        res.status(401).json({
          error: "Authentication failed!",
        });
      }
    }
  } catch {
    res.status(401).json({
      error: "Authentication failed!",
    });
  }
});

module.exports = router;