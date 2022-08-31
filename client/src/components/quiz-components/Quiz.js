import {useContext, useState} from "react";
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import {confirm} from "react-confirm-box";
import {QuizContext} from "./QuizContext";
import {UserContext} from "../UserContext";
import Header from "../Header";
import QuizHeader from './quiz-subcomponents/QuizHeader';

const Quiz = () => {

  const {activeQuiz} = useContext(QuizContext);
  const {credentials} = useContext(UserContext);
  
  const {quizId} = useParams();

  const [questionIndex, setQuestionIndex] = useState(0)
  const [answerInput, setAnswerInput] = useState(null);
  const [messageText, setMessageText] = useState("");

  const navigate = useNavigate();

  const handleAnswerSelect = e => {
    setAnswerInput(e.target.value)
    setMessageText("")
  }

  const submitAnswer = e => {
    e.preventDefault();
    if (answerInput === null) {
      setMessageText("Select an answer to continue");
    } else {
      const answeredQuestion = activeQuiz.shuffledQuestions[questionIndex]
      const newAnswer = {
        quizId,
        sessionId : activeQuiz.sessionId,
        answers : answeredQuestion.question.answers,
        topicName : answeredQuestion.topicName,
        questionText : answeredQuestion.question.questionText, 
        userAnswer : Number(answerInput),
        correctAnswer : answeredQuestion.question.correctAnswer
      }
      const requestBody = {
        userName : credentials.userName,
        password : credentials.password,
        newAnswer
      }
      // find user and update:
      axios.post(`/user/answer/${credentials._id}`, requestBody)
        .then(res => console.log(res.data))
        .catch(err => console.log(err))
      // if user is on final question, navigate to main, otherwise iterate index val
      if (questionIndex + 1 === activeQuiz.shuffledQuestions.length) {
        navigate("/menu/");
      } else {
        setQuestionIndex(prevIndex => prevIndex + 1);
        setAnswerInput(null)
      }
    }
  }
  
  // functions to 1) handle the click of sub-button on form and 
  // 2) uses a confirmation box to dictate whether or not to exit
  const confirmExit = async () => {
    const options = {
      labels: {
        confirmable: "Yes, get me out of this thing",
        cancellable: "No, I have a few more questions in me"
      }
    }
    const userRes = await confirm("Are you sure you want to exit the quiz?", options);
    console.log(userRes)
    if (userRes) {
      navigate("/menu/")
    }
  }
  const exitHandler = e => {
    e.preventDefault()
    confirmExit()
    return false;
  }

  // function to return question component, given an index number
  const displayQuestion = (questionNumber) => {
    const {questionText, answers} = activeQuiz.shuffledQuestions[questionNumber].question;
    return (
      <div>
        <p className="questionText">{questionText}</p>
        {answers.map((answer, index) => {
          return (
            <div className="questionContainer" key={index}>
              <div className="questionInputContainer">
                <input 
                  className="radioInput"
                  type="radio"
                  value={index}
                  checked={answerInput === index}
                  name={"answerSelection"}
                  onChange={handleAnswerSelect}
                />
              </div>
              <div className="questionTextContainer">
                <p className="answerText">{answer}</p>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return(
    <main>
      <Header negateMetrics={true}/>
      <div> {/*
        Don't delete this div - 
        it is required in order to ensure quizContainer fits screen properly 
      */}
        <div className="quizContainer">
          {activeQuiz && 
            <div className="quizDetail">
              <QuizHeader quizName={activeQuiz.quizName} subject={activeQuiz.subject} />
                <form className="quizForm" onSubmit={submitAnswer}>
                  {displayQuestion(questionIndex)}
                  <div className="quizConfigButtonContainer">
                    <button className="quizNavButton" onClick={exitHandler}>Exit Quiz</button>  
                    <button className="quizNavButton">
                      {questionIndex === (activeQuiz.shuffledQuestions.length - 1) ? "Finish" : 
                        "Next Question"}
                    </button>
                  </div>
                </form>
                <p className="userMessage quizMessage">{messageText}</p>
            </div>
          }
        </div>
      </div>
    </main>
  )
}
export default Quiz;