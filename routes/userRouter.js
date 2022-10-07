const express = require("express");
const dl = require("datalib");
const userRouter = express.Router();
const User = require("../models/user");
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

      Result.find({userId : userId}, (err, results) => {
        if (err) {
          res.status(500);
          return next(err);
        }
        res.send({
          totalAnswers : results.length,
          totalCorrect : results.reduce( (prev, curr) => curr.isCorrect + prev, 0)
        });

      })

      User.findOne({_id : userId}, (err, user) => {

        
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

      Result
        .find({userId : userId})
        .populate("quizId")
        .then((results, err) => {
          if (err) {
            res.status(500);
            return next(err);
          }
          const summarizedResults = results
                    .map(result => {
                      const resultObject = result.toObject();
                      const {quizName, subject} = resultObject.quizId;
                      delete resultObject.quizId;
                      return {...resultObject, quizName, subject}
                    });
          // Aggregate results by topics:
            const aggregatedTopics = dl
                .groupby("subject", "topicName")
                .execute(summarizedResults);
          // Aggregate results by Subject:
            const aggregatedSubjects = dl
              .groupby("subject")
              .execute(summarizedResults);
          // Aggregate results by Quiz:
            const aggregatedQuizzes = dl
              .groupby("quizName")
              .execute(summarizedResults);
          // Create summary objects
            // Topics
              const summarizedTopics = aggregatedTopics.map(element => {
                const totalCorrect = dl.sum(element.values.map(value => value.isCorrect));
                const totalAttempted = element.values.length;
                return {
                  subject : element.subject,
                  topic : element.topicName,
                  totalCorrect,
                  totalAttempted
                }
              });
            // Subject
              const summarizedSubjects = aggregatedSubjects.map(element => {
                const totalCorrect = dl.sum(element.values.map(value => value.isCorrect));
                const totalAttempted = element.values.length;
                return {
                  subject : element.subject,
                  totalCorrect,
                  totalAttempted
                }
              });
            // Quiz
              const summarizedQuizzes = aggregatedQuizzes.map(element => {
                const totalCorrect = dl.sum(element.values.map(value => value.isCorrect));
                const totalAttempted = element.values.length;
                return {
                  quizName : element.quizName,
                  totalCorrect,
                  totalAttempted
                }
              });
            // send results
            res.send({
              summarizedSubjects,
              summarizedQuizzes,
              summarizedTopics
            })
      })
    })

  // get historical results of a specific quizId for a given user.
    userRouter.get("/historical/summary", (req, res, next) => {
      const jwt = req.get('Authorization').toString().replace("Bearer ", "").trim();
      const {_id : userId} = jwt_decode(jwt);
      const {quizId} = req.query;

      Result
        .find({quizId : quizId, userId : userId}, (err, results) => {
          if (err) {
            res.status(500);
            return next(err);
          }
          const summarizedResults = results
                    .map(result => {
                      const resultObject = result.toObject();
                      const {quizName, subject} = resultObject.quizId;
                      delete resultObject.quizId;
                      return {...resultObject, quizName, subject}
                    });
          // Aggregate results by topics:
            const aggregatedTopics = dl
                .groupby("topicName")
                .execute(summarizedResults);
          // Create summary objects
            // Topics
              const summarizedTopics = aggregatedTopics
                .map(element => {
                  const correctAnswers = dl.sum(element.values.map(value => value.isCorrect));
                  const totalAnswers = element.values.length;
                  const percentCorrect = Math.round((correctAnswers / totalAnswers)*1000)/10;
                  return {
                    topic : element.topicName,
                    correctAnswers,
                    totalAnswers, 
                    percentCorrect 
                  }
                })
                .sort((a, b) => a.percentCorrect < b.percentCorrect ? 1 : -1)

            // send results
              res.send(summarizedTopics)
        });
    })

  // get historical results of a specific quizId for a given user.
    userRouter.get("/historical/results", (req, res, next) => {
      const jwt = req.get('Authorization').toString().replace("Bearer ", "").trim();
      const {_id : userId} = jwt_decode(jwt);
      const {quizId} = req.query;

      Result.find({quizId : quizId, userId : userId}, (err, results) => {
        if (err) {
          res.status(500);
          return next(err);
        }
        const sessionResults = results.map(element => {
          const {topicName : topic, quizId, questionText, sessionId, userAnswer, correctAnswer, answers} = element;
          const [year, month, day, hour, minute] = sessionId.split("_");
          const dateTime = new Date(year, month, day, hour, minute);
          return {
            sessionId, 
            dateTime,
            topic, 
            questionText,
            correctAnswer, answers,
            userAnswer
          }
        })

        const aggregatedSessions = dl
          .groupby("sessionId")
          .execute(results);

        const sessionSummaries = aggregatedSessions
          .map(aggResult => {
            const {sessionId} = aggResult;
            const [year, month, day, hour, minute] = sessionId.split("_");
            const dateTime = new Date(year, month, day, hour, minute);
            const correctAnswers = dl.sum(aggResult.values.map(value => value.isCorrect));
            const totalAnswers = aggResult.values.length;
            const percentCorrect = Math.round((correctAnswers / totalAnswers)*1000)/10;
            return {
              sessionId,
              dateTime,
              correctAnswers,
              totalAnswers, 
              percentCorrect 
            }
          })
          .sort((a, b) => a.dateTime < b.dateTime ? 1 : -1)

        res.send({sessionResults, sessionSummaries})
      });
    })

module.exports = userRouter;