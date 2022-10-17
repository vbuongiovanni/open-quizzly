const express = require("express");
const quizRoute = express.Router();
const Quiz = require("../models/quiz");
const jwt_decode = require("jwt-decode");

// get single quiz for edits
  quizRoute.get("/:quizId", (req, res, next) => {
    const {quizId} = req.params;
    const jwt = req.get('Authorization').toString().replace("Bearer ", "").trim();
    const {_id : userId} = jwt_decode(jwt);
    Quiz.findOne({_id : quizId, authorId : userId}, (err, quiz) => {
      if (err) {
        res.status(500);
        return next(err);
      }
      if (!quiz) {
        res.status(403);
        return next(err);
      }
      const {quizName, subject} = quiz;
      const topics = quiz.topics.map(topic => {
        const {topicName, topicNumber} = topic;
        const questions = topic.questions.map(question => {
          const {questionText, correctAnswer, questionNumber} = question;
          const [incorrectAnswer1, incorrectAnswer2, incorrectAnswer3] = question.incorrectAnswers;
          return {questionText, correctAnswer, questionNumber, incorrectAnswer1, incorrectAnswer2, incorrectAnswer3}
        })
        return {topicName, topicNumber, questions}
      })
      res.send({quizName, subject, topics})
    })
  })

// get all quizzes
  quizRoute.get("/", (req, res, next) => {
    const {authorId} = req.query;
    Quiz
      .find({})
      .populate("authorId")
      .then((quizzes, err) => {
        if (err) {
          res.status(500);
          return next(err);
        }
        const quizCardData = quizzes.map(quiz => {
          const {_id, quizName, subject, topics} = quiz;
          const authorId = quiz.authorId._id;
          const topicsText = topics.map(topic => {
            const {topicName} = topic;
            let properTopicName = "";
            for (let c in topicName) {
              if (c === "0" || topicName[c - 1] === " ") {
                properTopicName = properTopicName += topicName[c].toUpperCase()
              } else {
                properTopicName = properTopicName += topicName[c]
              }
            }
            return properTopicName;
          }).join(", ");
          return {_id, authorId, quizName, subject, topicsText};
        })
        if (authorId) {
          res.send(quizCardData.filter(quiz => quiz.authorId.toString() === authorId));
        } else {
          res.send(quizCardData);
        }
      });
  });

// get high level details of a single quiz
  quizRoute.get("/detail/:quizId", (req, res, next) => {
    const {quizId} = req.params;
    Quiz.findOne({_id : quizId}, (err, quiz) => {
      if (err) {
        res.status(500);
        return next(err);
      }
      const {quizName, subject, topics} = quiz;
      const topicSelections = topics.map(topic => ({[topic.topicName] : true}))
      res.send({quizName, subject, topicSelections});
    })
  })

// given a :quizId and request body, endpoint responds w/ filtered and randomized quiz
  quizRoute.post("/generate/:quizId", (req, res, next) => {   
    const quizConfiguration = req.body;
    const {quizId} = req.params;
    /* Randomize array in-place using Durstenfeld shuffle algorithm */
    // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    const shuffleArray = array => {
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      return (array);
    }
    Quiz.findOne({_id : quizId}, (err, responseQuiz) => {
      if (err) {
        res.status(500);
        return next(err);
      }
      const desiredTopics = quizConfiguration.includedTopics;
      let filteredQuiz = responseQuiz.topics
                                      .filter(topic => desiredTopics
                                        .includes(topic.topicName)
                                      );
      const topics = filteredQuiz.map(topic => {
        const questions = topic.questions.map(question => {
          const {correctAnswer, incorrectAnswers, questionText} = question;
          let answers = [...incorrectAnswers, correctAnswer];
          answers = shuffleArray(answers);
          return ({questionText, answers, correctAnswer : answers.indexOf(correctAnswer)});
        })
        return ({...topic, questions});
      })
      // aggregate all questionItems, consisting of topicName, question, and question text
      // array, then shuffle array.
      let shuffledQuestions = []
      topics.map(topic => {
        topic.questions.map(question => {
        const questionItem = {topicName : topic.topicName, question}
        shuffledQuestions.push(questionItem)
        })
      })
      shuffledQuestions = shuffleArray(shuffledQuestions)
      let sessionId = new Date();
      let randomNumber = Math.ceil(Math.random() * 1000000000);
      // build session ID (YEAR_MONTH_DATE_HOUR_MINUTE_SECOND_randomID)
      sessionId = 
                  `${sessionId.getFullYear()}_${sessionId.getMonth()}_` + 
                  `${sessionId.getDate()}_${sessionId.getHours()}_` + 
                  `${sessionId.getMinutes()}_${sessionId.getSeconds()}_` + 
                  `${randomNumber}`
      res.send({
        quizName : responseQuiz.quizName,
        subject : responseQuiz.subject,
        sessionId ,
        shuffledQuestions
      });
    });
  });

// endpoint to add quiz to local MongoDB
  quizRoute.post("/add", (req, res, next) => {
    // destructure contents of req body to capture only expected fields
    const {quizName, subject, topics} = req.body;
    const jwt = req.get('Authorization').toString().replace("Bearer ", "").trim();
    const {_id : userId} = jwt_decode(jwt);
    
    // validate that quizName isn't already taken 
    Quiz.findOne({quizName : quizName}, (err, quiz) => {
      if (quiz) {
        const errMsg = new Error(`Looks like "${quizName}" is already taken as a quiz name... try to come up with a different name that has a little more 'pizzazz'!`);
        res.status(500);
        return next(errMsg);
      } else {
        const cleanedTopics = topics.map(topic => {
          const {topicName, topicNumber} = topic
          const questions = topic.questions.map(question => {
            const {questionText, correctAnswer, incorrectAnswer1, incorrectAnswer2, incorrectAnswer3, questionNumber} = question;
            return {questionText, correctAnswer, questionNumber, incorrectAnswers : [incorrectAnswer1, incorrectAnswer2, incorrectAnswer3]}
          });
          return {topicName, topicNumber, questions}
        })
        const quizDetails = {quizName : quizName, subject, authorId : userId, topics : cleanedTopics}
        const newQuiz = new Quiz(quizDetails)
        newQuiz.save((err, savedQuiz) => {
          if (err) {
          res.status(500);
          return next(err);
          }
          res.send(savedQuiz)
        })
      }
    });
  });

// endpoint to edit quiz
  quizRoute.put("/edit/:quizId", (req, res, next) => {
    // destructure contents of req body to capture only expected fields
    const {quizName, subject, topics} = req.body;
    const {quizId} = req.params;
    const jwt = req.get('Authorization').toString().replace("Bearer ", "").trim();
    const {_id : userId} = jwt_decode(jwt);
    const cleanedTopics = topics.map(topic => {
      const {topicName, topicNumber} = topic;
      const questions = topic.questions.map(question => {
        const {questionText, correctAnswer, incorrectAnswer1, incorrectAnswer2, incorrectAnswer3, questionNumber} = question;
        return {questionText, correctAnswer, questionNumber, incorrectAnswers : [incorrectAnswer1, incorrectAnswer2, incorrectAnswer3]};
      });
      return {topicName, topicNumber, questions};
    })

    Quiz.find({_id : {$ne : quizId}}, (err, quizzes) => {
      const unavailableNames = quizzes.map(quiz => quiz.quizName);
      if (err) {
        res.status(500);
        return next(err);
      }
      if (unavailableNames.includes(quizName)) {
        const errMsg = new Error(`Looks like "${quizName}" is already taken as a quiz name... try to come up with a different name that has a little more 'pizzazz'!`);
        res.status(500);
        return next(errMsg);
      }
      const quizDetails = {quizName : quizName, subject, authorId : userId, topics : cleanedTopics};
  
      // search for quizId and ensure token matches db:
      Quiz.findOne({_id : quizId}, (err, existingQuiz) => {
        if (err) {
          res.status(500);
          return next(err);
        };
        Quiz.findOneAndUpdate(
          {_id : quizId, authorId : userId},
          {...quizDetails, __v : existingQuiz.__v + 1},
          {runValidators : true, returnOriginal : false},
          (err, updatedQuiz) => {
            if (err) {
              res.status(500);
              return next(err);
            }
            res.send(updatedQuiz);
        });
      });
    });
  });

// endpoint to delete quiz
  quizRoute.delete("/:quizId", (req, res, next) => {
    // destructure contents of req body to capture only expected fields
    const {quizId} = req.params;
    const jwt = req.get('Authorization').toString().replace("Bearer ", "").trim();
    const {_id : userId} = jwt_decode(jwt);

    // search for quizId and ensure token matches db:
    Quiz.findOneAndDelete({_id : quizId}, (err, existingQuiz) => {
      if (err) {
        res.status(500);
        return next(err);
      }
      res.send(`${existingQuiz._id} deleted.`)
    });
  });

module.exports = quizRoute;