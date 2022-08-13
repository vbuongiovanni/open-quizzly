const express = require("express");
const userRouter = express.Router();
const userModel = require("../models/user");

// login 
userRouter.post("/", (req, res, next) => {    
    const {userName, password} = req.body;
    userModel.find({userName : userName}, (err, users) => {
        if (err) {
            res.status(500);
            return next(err);
        }
        // If user doesn't exist, add them
        if (users.length === 0) {
            const newUser = new userModel({
                userName,
                password,
                results : []
            })
            newUser.save((err, savedUser) => {
                res.send(savedUser);
            })
        // otherwise, check password:
        } else {
            const [user] = users;
            // if passwords match, then return user details
            if (user.password === password){
                res.send(user);
            } else {
                // throw error with descriptive message if credentials dont match
                const invalidLogin = new Error();
                invalidLogin.message = "User credentials didn't match";
                res.status(500);
                return next(invalidLogin);
            }
        }
    })
})

// Submit answer
userRouter.post("/:userName", (req, res, next) => {
    const {userName} = req.params
    const newAnswer = req.body
    // get user with their existing responses:
    userModel.findOne(
        {userName : userName},
        (err, returnedUser) => {
            if (err) {
                res.status(500);
                return next(err);
            }
            const {password, results} = returnedUser;
            userModel.findOneAndUpdate(
                {userName : userName},
                {
                    userName,
                    password,
                    results : [...results, newAnswer]
                },
                {new : true},
                (err, returnedUser) => {
                    if (err) {
                        res.status(500);
                        return next(err);
                    }
                    res.send("Answer Saved")
                }
            )


        }
    )


})


module.exports = userRouter;