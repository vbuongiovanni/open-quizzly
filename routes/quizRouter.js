const express = require("express");
const quizRoute = express.Router();
const quizModel = require("../models/quiz")

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

// endpoint to add real quiz to local MongoDB
quizRoute.post("/quiz/:newQuizName", (req, res, next) => {    
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
                    topicName : "mulitplication",
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

// endpoint to add mock quizzes to everyone's local MongoDB
quizRoute.post("/newQuiz/:newQuizName", (req, res, next) => {    
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
                    topicName : "mulitplication",
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