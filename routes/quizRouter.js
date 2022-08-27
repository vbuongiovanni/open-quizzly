const express = require("express");
const quizRoute = express.Router();
const quizModel = require("../models/quiz");

// get all quizzes
quizRoute.get("/", (req, res, next) => {    
    quizModel.find({}, (err, quizzes) => {
        if (err) {
            res.status(500);
            return next(err);
        }
        res.send(quizzes);
    })
})

// get single quiz 
quizRoute.get("/:quizId", (req, res, next) => {
    const {quizId} = req.params;
    quizModel.findOne({_id : quizId}, (err, quiz) => {
        if (err) {
            res.status(500);
            return next(err);
        }
        const {quizName, subject, topics} = quiz;
        const topicSelections = topics
          .map(topic => ({[topic.topicName] : true}))
        res.send({quizName, subject, topicSelections});
    })
})

// given a :quizId and request body, endpoint responds w/ filtered and randomized quiz
// filters by topic
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

    quizModel.findOne({_id : quizId}, (err, responseQuiz) => {
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
        sessionId = `${sessionId.getFullYear()}_${sessionId.getMonth()}_` + 
                    `${sessionId.getDate()}_${sessionId.getHours()}_` + 
                    `${sessionId.getMinutes()}_${sessionId.getSeconds()}_` + 
                    `${randomNumber}`

        res.send({
            quizName : responseQuiz.quizName,
            subject : responseQuiz.subject,
            sessionId ,
            shuffledQuestions
        });
    })
})

// endpoint to add real quiz to local MongoDB
quizRoute.post("/add/:newQuizName", (req, res, next) => {
    const quizDetails = req.body;
    const {newQuizName} = req.params;
    const newQuiz = new quizModel(quizDetails)
    newQuiz.save((err, savedQuiz) => {
        if (err) {
            res.status(500);
            return next(err);
        }
        res.send(savedQuiz)
    })
})

// endpoint to add mock quizzes to everyone's local MongoDB
quizRoute.post("/mockQuiz/:newQuizName", (req, res, next) => {    
    // **mock quiz question response**
    const createFakeQuiz = quizName => {

        const quizDetails = {
            quizName : quizName,
            subject : "Math",
            topics : [
                {
                    topicName : "Addition",
                    questions : [
                        {
                            questionText : "What is 2 + 2",
                            correctAnswer : "2",
                            incorrectAnswers : ["5", "4", "22"]
                        },
                        {
                            questionText : "What is 4 + 4",
                            correctAnswer : "8",
                            incorrectAnswers : ["0", "44", "4"]
                        },
                    ],
                },
                {
                    topicName : "multiplication",
                    questions : [
                        {
                            questionText : "What is 2 * 2",
                            correctAnswer : "4",
                            incorrectAnswers : ["0", "44", "22"]
                        },
                        {
                            questionText : "What is 0 * 4",
                            correctAnswer : "0",
                            incorrectAnswers : ["10", "44", "4"]
                        }
                    ],
                },
            ]
        }

        const newQuiz = new quizModel(quizDetails)
        
        newQuiz.save((err, savedQuiz) => {
            if (err) {
                res.status(500);
                return next(err);
            }
            res.send(savedQuiz)
        })

    }

    const {newQuizName} = req.params;

    createFakeQuiz(newQuizName);
})

module.exports = quizRoute