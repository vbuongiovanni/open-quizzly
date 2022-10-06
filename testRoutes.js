const axios = require("axios");
const jwt_decode = require("jwt-decode");

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

// init request body - login:
  const body = {
    username : "peteDavidasdfsa" + Math.round(Math.random()*(1000000000000)),
    password : "test123",
    confirmPassword : "test123"
  };

  let token;

  const testSignUp = (body) => {
    axios.post("http://localhost:9000/auth/signup", body)
      .then(res => res.data)
      .then(data => {
        console.log({
          Type : "signup",
          reqUsername : body.username.toLowerCase(),
          resUsername : jwt_decode(data.token).username,
          Match : body.username.toLowerCase() === jwt_decode(data.token).username
        })
      })
      .catch(err => console.log(err))
  };

  const testLogin = (body) => {
    axios.post("http://localhost:9000/auth/login", body)
      .then(res => res.data)
      .then(data => {
        token = data.token;
        console.log({
          Type : "login",
          reqUsername : body.username.toLowerCase(),
          resUsername : jwt_decode(data.token).username,
          Match : body.username.toLowerCase() === jwt_decode(data.token).username
        })
      })
      .catch(err => console.log(err))
  };

// sign up user:
testSignUp(body);

// log user in
setTimeout(() => {
  testLogin(body)
}, 1000);


// authenticated requests


  // post templated quizzes:
    const postQuiz = (token, quizData) => {
      let config = {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
      axios.post("http://localhost:9000/api/quiz/add/", quizData, config)
        .then(res => res.data)
        .catch(err => console.log(err))
    }

    setTimeout(() => postQuiz(token, unpackQuizData(reactDesignPatternsQuiz)), 3000)
    setTimeout(() => postQuiz(token, unpackQuizData(html5Quiz)), 3500)

  
  // request all quizzes:
    setTimeout(() => {
      let config = {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
      axios.get("http://localhost:9000/api/quiz", config)
        .then(res => console.log(res.data))
    }, 2000);

