const express = require("express");
const dl = require("datalib");
const userRouter = express.Router();
const userModel = require("../models/user");
const quizModel = require("../models/quiz");

// user action endpoints:
  // post new answer
    userRouter.post("/answer/:userId", (req, res, next) => {
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
          if (password === req.body.password) {
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
          } else {
            res.status(500);
            const err = new Error("User authentication error.");
            return next(err);
          }
        }
      )
    })

  // get basic stats of user - using post to incorporate username/password
    userRouter.post("/summary/:userId", (req, res, next) => {  
      const {userName, password} = req.body;

      userModel.findOne({userName : userName}, (err, user) => {
        if (err) {
          res.status(500);
          return next(err);
        }

        // If user doesn't exist, throw error:
        if (user.length === 0) {
          res.status(401);
          const err = new Error("User not found or credentials don't match. Please try again or create a new account.");
          return next(err);
        // otherwise, check password:
        } else {
          // if passwords match, then return user details
          if (user.password === password){
            // create array of results, by quiz & topic name
            const quizSummary = user.results.map(result => ({
              quizId : result.quizId,
              topicName : result.topicName,
              isCorrect : result.userAnswer === result.correctAnswer ? 1 : 0
            }));
            // aggregate results by quiz ID and topic name
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

            quizModel.find({}, (err, quizzes) => {
              const {results} = user;
              const namedResults = results.map(result => {
                const {quizId} = result;
                const {quizName, subject} = quizzes.find(quiz => quiz._id.toString() === quizId)
                return {
                  quizName,
                  subject,
                  ...result
                }
              })
              res.send({
                results : namedResults, 
                summaryStats,
                globalStats : {
                  globalTotal,
                  globalCorrectTotal
                }
              });
            })
            
          } else {
            // otherwise, throw error
            res.status(401);
            const err = new Error("User not found or credentials don't match. Please try again or create a new account.");
            return next(err);
          }
        }
      })
    })

  // get global stats of user - using post to incorporate username/password
    userRouter.post("/global/:userId", (req, res, next) => {  
      const {userName, password} = req.body;

      userModel.findOne(
        {userName : userName, password : password},
        (err, user) => {
          if (err) {
            res.status(500);
            const err = new Error("Something went wrong. please log out and log back in.");
            return next(err);
          } else {
            const {results} = user;
            // this joins in the quizName and Subject into the result array
            // note that I considered using .populate() for this, but I decided against it because
            // the common property that could be used to ref between the two collections is deeply nested
            quizModel.find({}, (err, quizzes) => {
              const namedResults = results.map(result => {
                const {quizId, totalCorrect, totalAttempted} = result;
                const {quizName, subject} = quizzes.find(quiz => quiz._id.toString() === quizId)
                return {
                  quizId,
                  quizName,
                  subject,
                  topic : result.topicName,
                  isCorrect : result.correctAnswer === result.userAnswer,
                }
              })
              // Aggregate results by topics:
                const aggregatedTopics = dl
                  .groupby("subject", "topic")
                  .execute(namedResults)
              // Aggregate results by Subject:
                const aggregatedSubjects = dl
                  .groupby("subject")
                  .execute(namedResults)
              // Aggregate results by Quiz:
                const aggregatedQuizzes = dl
                  .groupby("quizName")
                  .execute(namedResults)
              // Create summary objects
                // Topics
                  const summarizedTopics = aggregatedTopics.map(element => {
                    const totalCorrect = dl.sum(element.values.map(value => value.isCorrect));
                    const totalAttempted = element.values.length;
                    return {
                      subject : element.subject,
                      topic : element.topic,
                      totalCorrect,
                      totalAttempted
                    }
                  })
                // Subject
                  const summarizedSubjects = aggregatedSubjects.map(element => {
                    const totalCorrect = dl.sum(element.values.map(value => value.isCorrect));
                    const totalAttempted = element.values.length;
                    return {
                      subject : element.subject,
                      totalCorrect,
                      totalAttempted
                    }
                  })
                // Quiz
                  const summarizedQuizzes = aggregatedQuizzes.map(element => {
                    const totalCorrect = dl.sum(element.values.map(value => value.isCorrect));
                    const totalAttempted = element.values.length;
                    return {
                      quizName : element.quizName,
                      totalCorrect,
                      totalAttempted
                    }
                  })
              res.send({
                summarizedTopics,
                summarizedSubjects,
                summarizedQuizzes
              })
            })
          }
      })


    })

  // get historical results of a specific quizId for a given user.
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