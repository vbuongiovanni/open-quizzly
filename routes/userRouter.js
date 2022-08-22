const express = require("express");
const dl = require("datalib");
const userRouter = express.Router();
const userModel = require("../models/user");

// existing user login
userRouter.post("/", (req, res, next) => {  
  const {userName, password} = req.body;

  userModel.find({userName : userName}, (err, users) => {
    if (err) {
      res.status(500);
      return next(err);
    }

    // If user doesn't exist, throw error:
    if (users.length === 0) {
      res.status(401);
      const err = new Error("User not found or credentials don't match. Please try again or create a new account.");
      return next(err);
    // otherwise, check password:
    } else {
      const [user] = users;
      // if passwords match, then return user details
      if (user.password === password){
        // create array of results, by quiz & topic name
        const quizSummary = user.results.map(result => ({
          quizId : result.quizId,
          topicName : result.topicName,
          isCorrect : result.userAnswer === result.correctAnswer ? 1 : 0
        }));
        // aggregate results by quizz ID and topic name
        const aggregated = dl
          .groupby("quizId", "topicName")
          .execute(quizSummary)

        // create counters for global metrics
        let globalTotal = 0;
        let globalCorrectTotal = 0;
        
        // create summaryStats, showing the various statics of results
        const summaryStats = aggregated.map(element => {
          const totalCorrect = dl.sum(element.values.map(value => value.isCorrect)) + 0.00;
          globalCorrectTotal = globalCorrectTotal + totalCorrect;
          const totalAnswered = element.values.length + 0.00;
          globalTotal = globalTotal + totalAnswered;
          return {
            quizId : element.quizId,
            topicName : element.topicName,
            totalAnswers : totalAnswered,
            correctAnswers : totalCorrect, 
            percentCorrect : Math.round((totalCorrect / totalAnswered) * 10000)/10000
          }
        });

        res.send({
          userName : user.userName, 
          password : user.password, 
          results : user.results, 
          _id : user._id,
          summaryStats,
          globalStats : {
            globalTotal,
            globalCorrectTotal
          }
        });
      } else {
        // otherwise, throw error
        res.status(401);
        const err = new Error("User not found or credentials don't match. Please try again or create a new account.");
        return next(err);
      }
    }
  })
})

// create new user
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

// submit answer
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

// get historical details results
userRouter.get("/history/:userId", (req, res, next) => {
  const {userId} = req.params;
  const {quizId} = req.query;
  
  userModel.findOne({_id : userId}, (err, user) => {
    if (err) {
      res.status(500);
      const err = new Error("Something went wrong... please try to login again.");
      return next(err);
    }
    // get summary of all results 
    const quizSummary = user.results.filter(result => result.quizId === quizId).map(result => ({
      topicName : result.topicName,
      sessionId : result.sessionId,
      isCorrect : result.userAnswer === result.correctAnswer ? 1 : 0
    }));

    // aggregate results by quizz ID and topic name
    const aggregated = dl
      .groupby("topicName")
      .execute(quizSummary)
    
    // create historicalStats, showing the various statics of results
    const historicalStats = aggregated.map(element => {
      const totalCorrect = dl.sum(element.values.map(value => value.isCorrect)) + 0.00;
      const totalAnswered = element.values.length + 0.00;
      return {
        topicName : element.topicName,
        totalAnswers : totalAnswered,
        correctAnswers : totalCorrect, 
        percentCorrect : Math.round((totalCorrect / totalAnswered) * 10000)/10000
      }
    })
    res.send(historicalStats);
  })
})
module.exports = userRouter;