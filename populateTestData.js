const axios = require("axios");

// load template quiz
const reactDesignPatternsQuiz = require("./quiz-content/Design Patterns in React.json")
const html5Quiz = require("./quiz-content/HTML5.json")

const unpackQuizData = quizData => {

    const {quizName, quizSubject} = quizData;
    let topics = Object.values(quizData.topics);
    topics = topics.map(topic => ({...topic, questions : Object.values(topic.questions)}))

    // topics.map(topic => topic.questions.map(question => console.log(question)))

    const quizDetails = {
        quizName : quizName,
        subject : quizSubject,
        topics : topics
    }

    return (quizDetails);
}

axios.post("http://localhost:9000/quiz/add/" + reactDesignPatternsQuiz.quizName, unpackQuizData(reactDesignPatternsQuiz))
    .then(res => res.data)
    .catch(err => console.log(err))

axios.post("http://localhost:9000/quiz/add/" + html5Quiz.quizName, unpackQuizData(html5Quiz))
    .then(res => res.data)
    .catch(err => console.log(err))

// define functions to load mock-data

const populateUser = async (userName, password) => {
    const body = {
        userName, 
        password,
        confirmPassword : password,
        results : []
    }
    const res = await axios.post("http://localhost:9000/user/new", body);
    console.log(`${userName} added to db`);
}

const populateQuiz = async (quizName) => {
    const res = await axios.post("http://localhost:9000/quiz/mockQuiz/" + quizName);
    console.log(`${res.data.quizName} added to db`);
}

const populateQuizResult = async (userName, password) => {
    const res = await axios.get("http://localhost:9000/quiz/");
    
    let answers = [];
    res.data.map(quiz => {
        const {quizName, _id, subject} = quiz;
        quiz.topics.map(topic => {
            const {topicName} = topic;
            topic.questions.map((question, index) => {
                const {questionText, correctAnswer, incorrectAnswers} = question;
                let allAnswers = [correctAnswer, ...incorrectAnswers] 
                const userAnswer = allAnswers[Math.floor(allAnswers.length*Math.random())]
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
                allAnswers = shuffleArray(allAnswers)
                
                const body = {
                    quizId : _id, 
                    answers : allAnswers,
                    topicName,
                    userAnswer : allAnswers.indexOf(userAnswer), 
                    questionText, 
                    correctAnswer : allAnswers.indexOf(correctAnswer), 
                }
                answers = [...answers, {...body, _id}];
            })
        })
    })

    // some records aren't saving to mongoDB, presumably because node is sending
    // requests too quickly... using this recursive function to delay the requests. 
    const body = {
        userName, 
        password : "Password1234",
    }
    const userRes = await axios.post("http://localhost:9000/user/", body)
        .catch(err => console.log(err))
    const userData = await userRes.data
    
    const sendPutRequest = (userId, answers, iteration) => {
        if (iteration < answers.length) {
            setTimeout(() => {
                axios.post("http://localhost:9000/user/" + userId, {...body, newAnswer : answers[iteration]})
                iteration++;
                sendPutRequest(userId, answers, iteration);
                }, 500);
        }
    }
    sendPutRequest(userData._id, answers, 0)
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

// run recursive functions to load user tables/result arrays
    loadUserCollection(0);


