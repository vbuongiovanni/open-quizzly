const express = require("express");
const authRouter = express.Router();
const User = require("../models/user.js");
const jwt = require("jsonwebtoken");

// initial Signup
authRouter.post("/signup", (req, res, next) => {
  const {username, password, confirmPassword} = req.body;
  if (password !== confirmPassword) {
    res.status(403);
    const err = new Error("Passwords must match.");
    return next(err);
  }

  User.findOne({username : username}, (err, user) => {
    if (err) {
      res.status(500);
      return next(err);
    }
    if (user) {
      res.status(403);
      const err = new Error("Username already exists.");
      return next(err);
    } 
    const newUser = new User({
        username,
        password
    });

    newUser.save((err, savedUser) => {
        if (err) {
          res.status(500);
          return next(err);
        }
        const token = jwt.sign(savedUser.removePassword(), process.env.SECRET);
        res.status(201);
        res.send({user : savedUser.removePassword(), token});
    });
  });
});

// existing user login
authRouter.post("/login", (req, res, next) => {
  const {username, password} = req.body;
  const failedLogin = new Error("Username or password are incorrect.");

  User.findOne({username : username.toLowerCase()}, (err, user) => {
    if (err) {
      res.status(500);
      return next(err);
    }
    if (!user) {
      res.status(403);
      return next(failedLogin);
    }
    // use method from userSchema - 
    user.checkPassword(password, (err, isMatch) => {
      if (err) {
        res.status(500);
        return next(err);
      }
      if (!isMatch) {
        res.status(403);
        return next(failedLogin);
      }
      const token = jwt.sign(user.removePassword(), process.env.SECRET);
      res.status(200);
      res.send({user : user.removePassword(), token});
    })
  })
});

module.exports = authRouter;