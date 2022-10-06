const express = require("express");
const dl = require("datalib");
const userRouter = express.Router();
const User = require("../models/user");
const Quiz = require("../models/quiz");
const Result = require("../models/result");
const jwt_decode = require("jwt-decode");

// user action endpoints:
  // post new answer
    userRouter.post("/answer", (req, res, next) => {
      const jwt = req.get('Authorization').toString().replace("Bearer ", "").trim();
      const {_id : userId} = jwt_decode(jwt);

      const {newAnswer} = req.body
      const {quizId, sessionId} = newAnswer;
      // get user with their existing responses:
      const newResult = new Result({userId, ...newAnswer})

      newResult.save((err, addedResult) => {
        if (err) {
          res.status(500);
          return next(err);
        }
        User.findOne(
          {_id : userId},
          (err, user) => {
            if (err) {
              res.status(500);
              return next(err);
            }
            User.findOneAndUpdate(
              {_id : userId},
              {
                results : [...user.results, addedResult._id]
              },
              {new : true},
              (err, updatedUser) => {
                if (err) {
                  res.status(500);
                  return next(err);
                }
                res.send("Answer Saved")
              }
            );
          }
        )
      })

    })

  // get basic stats of user
    userRouter.get("/summary", (req, res, next) => {  
      const jwt = req.get('Authorization').toString().replace("Bearer ", "").trim();
      const {_id : userId} = jwt_decode(jwt);

      User.findOne({_id : userId}, (err, user) => {
        if (err) {
          res.status(500);
          return next(err);
        }

        res.send({
          results : [], 
          summaryStats : 0,
          globalStats : {
            globalTotal : 0,
            globalCorrectTotal : 0
          }
        });

        
        // // create array of results, by quiz & topic name
        // const quizSummary = user.results.map(result => ({
        //   quizId : result.quizId,
        //   topicName : result.topicName,
        //   isCorrect : result.userAnswer === result.correctAnswer ? 1 : 0
        // }));
        // // aggregate results by quiz ID and topic name
        // const aggregated = dl
        //   .groupby("quizId", "topicName")
        //   .execute(quizSummary)

        // // create counters for global metrics
        // let globalTotal = 0;
        // let globalCorrectTotal = 0;
        
        // // create summaryStats, showing the various statics of results
        // const summaryStats = aggregated.map(element => {
        //   const totalCorrect = dl.sum(element.values.map(value => value.isCorrect)) + 0.00;
        //   globalCorrectTotal = globalCorrectTotal + totalCorrect;
        //   const totalAnswered = element.values.length + 0.00;
        //   globalTotal = globalTotal + totalAnswered;
        //   return {
        //     quizId : element.quizId,
        //     topicName : element.topicName,
        //     totalAnswers : totalAnswered,
        //     correctAnswers : totalCorrect, 
        //     percentCorrect : Math.round((totalCorrect / totalAnswered) * 10000)/10000
        //   }
        // });

        // Quiz.find({}, (err, quizzes) => {
        //   const {results} = user;
        //   const namedResults = results.map(result => {
        //     const {quizId} = result;
        //     const {quizName, subject} = quizzes.find(quiz => quiz._id.toString() === quizId)
        //     return {
        //       quizName,
        //       subject,
        //       ...result
        //     }
        //   })
        //   res.send({
        //     results : namedResults, 
        //     summaryStats,
        //     globalStats : {
        //       globalTotal,
        //       globalCorrectTotal
        //     }
        //   });
        // })


      })
    })

  // get detailed stats of user
    userRouter.get("/global", (req, res, next) => {  
      const jwt = req.get('Authorization').toString().replace("Bearer ", "").trim();
      const {_id : userId} = jwt_decode(jwt);

      User.findOne(
        {_id : userId},
        (err, user) => {
          console.log(user)
          if (err) {
            res.status(500);
            const err = new Error("Something went wrong. please log out and log back in.");
            return next(err);
          } else {

            res.send("Send High level summary stats about each topic, quiz, and subject.")

            
            // const {results} = user;
            // // this joins in the quizName and Subject into the result array
            // // note that I considered using .populate() for this, but I decided against it because
            // // the common property that could be used to ref between the two collections is deeply nested
            // Quiz.find({}, (err, quizzes) => {
            //   const namedResults = results.map(result => {
            //     const {quizId, totalCorrect, totalAttempted} = result;
            //     const {quizName, subject} = quizzes.find(quiz => quiz._id.toString() === quizId)
            //     return {
            //       quizId,
            //       quizName,
            //       subject,
            //       topic : result.topicName,
            //       isCorrect : result.correctAnswer === result.userAnswer,
            //     }
            //   })
            //   // Aggregate results by topics:
            //     const aggregatedTopics = dl
            //       .groupby("subject", "topic")
            //       .execute(namedResults)
            //   // Aggregate results by Subject:
            //     const aggregatedSubjects = dl
            //       .groupby("subject")
            //       .execute(namedResults)
            //   // Aggregate results by Quiz:
            //     const aggregatedQuizzes = dl
            //       .groupby("quizName")
            //       .execute(namedResults)
            //   // Create summary objects
            //     // Topics
            //       const summarizedTopics = aggregatedTopics.map(element => {
            //         const totalCorrect = dl.sum(element.values.map(value => value.isCorrect));
            //         const totalAttempted = element.values.length;
            //         return {
            //           subject : element.subject,
            //           topic : element.topic,
            //           totalCorrect,
            //           totalAttempted
            //         }
            //       })
            //     // Subject
            //       const summarizedSubjects = aggregatedSubjects.map(element => {
            //         const totalCorrect = dl.sum(element.values.map(value => value.isCorrect));
            //         const totalAttempted = element.values.length;
            //         return {
            //           subject : element.subject,
            //           totalCorrect,
            //           totalAttempted
            //         }
            //       })
            //     // Quiz
            //       const summarizedQuizzes = aggregatedQuizzes.map(element => {
            //         const totalCorrect = dl.sum(element.values.map(value => value.isCorrect));
            //         const totalAttempted = element.values.length;
            //         return {
            //           quizName : element.quizName,
            //           totalCorrect,
            //           totalAttempted
            //         }
            //       })
            //   res.send({
            //     summarizedTopics,
            //     summarizedSubjects,
            //     summarizedQuizzes
            //   })
            // })
          }
      })
    })

  // get historical results of a specific quizId for a given user.
    userRouter.get("/historical/summary", (req, res, next) => {
      const jwt = req.get('Authorization').toString().replace("Bearer ", "").trim();
      const {_id : userId} = jwt_decode(jwt);
      const {quizId} = req.query;
      
      User.findOne({_id : userId}, (err, user) => {
        if (err) {
          res.status(500);
          const err = new Error("Something went wrong... please try to login again.");
          return next(err);
        }

        res.send([{topicName : "", totalAnswers : 0, correctAnswers : 0, percentCorrect : 0}])

        // // get summary of all results 
        // const quizSummary = user.results.filter(result => result.quizId === quizId).map(result => ({
        //   topicName : result.topicName,
        //   sessionId : result.sessionId,
        //   isCorrect : result.userAnswer === result.correctAnswer ? 1 : 0
        // }));

        // // aggregate results by quiz ID and topic name
        // const aggregated = dl
        //   .groupby("topicName")
        //   .execute(quizSummary)
        
        // // create historicalStats, showing the various statics of results
        // const historicalStats = aggregated.map(element => {
        //   const totalCorrect = dl.sum(element.values.map(value => value.isCorrect)) + 0.00;
        //   const totalAnswered = element.values.length + 0.00;
        //   return {
        //     topicName : element.topicName,
        //     totalAnswers : totalAnswered,
        //     correctAnswers : totalCorrect, 
        //     percentCorrect : Math.round((totalCorrect / totalAnswered) * 10000)/10000
        //   }

        // })
        // res.send(historicalStats);
      })
    })

  // get historical results of a specific quizId for a given user.
    userRouter.get("/historical/results", (req, res, next) => {
      const jwt = req.get('Authorization').toString().replace("Bearer ", "").trim();
      const {_id : userId} = jwt_decode(jwt);
      const {quizId} = req.query;
      
      User.findOne({_id : userId}, (err, user) => {
        if (err) {
          res.status(500);
          const err = new Error("Something went wrong... please try to login again.");
          return next(err);
        }

        res.send("send ALL results pertaining to the quizId, shown in the query params")

      })
    })

module.exports = userRouter;