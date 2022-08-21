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
            res.status(401);
            const err = new Error("User not found or credentials don't match. Please try again or create a new account.");
            return next(err);
        // otherwise, check password:
        } else {
            const [user] = users;
            // if passwords match, then return user details
            if (user.password === password){
                res.send(user);
            } else {
                // throw error with descriptive message if credentials dont match
                res.status(401);
                const err = new Error("User not found or credentials don't match. Please try again or create a new account.");
                return next(err);
            }
        }
    })
})

// new user
userRouter.post("/new", (req, res, next) => {    
    const {userName, password, confirmPassword} = req.body;
    if (password !== confirmPassword) {
        res.status(500);
        const err = new Error("Entered password does not match confirmation.");
        return next(err);
    }
    userModel.find({userName : userName}, (err, users) => {
        if (err) {
            res.status(500);
            const err = new Error("Provided password doesn't match confirmation");
            return next(err);
        } else if (users.length > 0) {
            res.status(500);
            const err = new Error("Username already exists.");
            return next(err);
        } else {
            const newUser = new userModel({
                userName,
                password,
                results : []
            })
            newUser.save((err, savedUser) => {
                res.send("User profile successfully created!");
            })
        }
    })
})


// Submit answer
userRouter.post("/:userId", (req, res, next) => {
    const {userId} = req.params
    const {userName, password, newAnswer} = req.body
    
    // get user with their existing responses:
    userModel.findOne(
        {_id : userId},
        (err, returnedUser) => {
            if (err) {
                res.status(500);
                return next(err);
            }
            const {password, results} = returnedUser;
            console.log(req.body)
            console.log(results)

            userModel.findOneAndUpdate(
                {userName : userName},
                {
                    userName,
                    password,
                    results : [...results, req.body.newAnswer]
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