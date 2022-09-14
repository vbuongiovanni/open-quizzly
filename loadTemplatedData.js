const axios = require("axios");

// load template quiz
const reactDesignPatternsQuiz = require("./quiz-content/Design Patterns in React.json")
const html5Quiz = require("./quiz-content/HTML5.json")

const unpackQuizData = quizData => {
    const {quizName, quizSubject} = quizData;
    let topics = Object.values(quizData.topics);
    parsedTopics = topics.map(topic => {
        const questions = Object.values(topic.questions);
        const parsedQuestions = questions.map(question => {
            const [incorrectAnswer1, incorrectAnswer2, incorrectAnswer3] = question.incorrectAnswers
            return {
                questionText : question.questionText,
                correctAnswer : question.correctAnswer,
                incorrectAnswer1,
                incorrectAnswer2,
                incorrectAnswer3
            }
        });
        return {topicName : topic.topicName, questions : parsedQuestions};
    })
    const quizDetails = {
        quizName : quizName,
        subject : quizSubject,
        topics : parsedTopics
    }
    return quizDetails;
}

axios.post("http://localhost:9000/quiz/add/", unpackQuizData(reactDesignPatternsQuiz))
    .then(res => res.data)
    .catch(err => console.log(err))

axios.post("http://localhost:9000/quiz/add/", unpackQuizData(html5Quiz))
    .then(res => res.data)
    .catch(err => console.log(err))
