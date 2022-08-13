const axios = require("axios");

const populateUser = async (userName, password) => {
    const body = {
        userName, 
        password
    }
    const res = await axios.post("http://localhost:9000/user/", body);
    console.log(`${res.data.userName} added to db`);
}

const populateQuiz = async (quizName) => {
    const res = await axios.post("http://localhost:9000/quiz/newQuiz/" + quizName);
    console.log(`${res.data.quizName} added to db`);
}

const populateQuizResult = async (userName) => {
    const res = await axios.get("http://localhost:9000/quiz/");
    const answers = [];

    res.data.map(quiz => {
        const {quizName, _id, subject} = quiz;
        quiz.topics.map(topic => {
            const {topicName} = quiz;
            topic.questions.map((question, index) => {
                const {questionText, correctAnswer, incorrectAnswers} = question;
                const allAnswers = [correctAnswer, ...incorrectAnswers] 
                const userAnswer = allAnswers[Math.floor(allAnswers.length*Math.random())]
                const body = {
                    quizName, 
                    quizId : _id, 
                    subject,
                    topicName,
                    questionNumber : (index + 1),
                    userAnswer, 
                    questionText, 
                    correctAnswer, 
                    incorrectAnswers,
                }
                answers.push(body);
            })
        })
    })

    // some records aren't saving to mongoDB, presumably because node is sending
    // requests too quickly... using this recursive function to delay the requests. 
    const sendPutRequest = (answers, iteration) => {
        if (iteration < answers.length) {
            setTimeout(() => {
                axios.post("http://localhost:9000/user/" + userName, answers[iteration])
                iteration++;
                sendPutRequest(answers, iteration);
                }, 500);
        } else {
            return "answers loaded"
        }
    }
    sendPutRequest(answers, 0);
}

// Populate results of users:
    const users = ["JohnDoe", "JackSmith", "JennyMiller", "StevenRoberts"];

// recursive funcs to avoid overloading mongo/node
    const loadQuizResults = (i) => {
        if (i < users.length) {
            setTimeout(() => {
                populateQuizResult(users[i], "Password1234");
                i++;
                loadQuizResults(i);
            }, 500);
        } else {
            return "All results loaded into user arrays";
        }
    }

    const loadUserCollection = (i) => {
        if (i < users.length) {
            setTimeout(() => {
                populateUser(users[i], "Password1234");
                i++;
                loadUserCollection(i);
            }, 500);
        } else {
            // after users are finished, load results
            loadQuizResults(0);
        }
    }

// populate 5 quizs:
    populateQuiz("A Sample Quiz");
    populateQuiz("Another Sample Quiz");
    populateQuiz("A third Sample Quiz");
    populateQuiz("A fourth Sample Quiz");
    populateQuiz("Yet, another Sample Quiz");

// run recursive functions to load user tables/result arrays
    loadUserCollection(0);