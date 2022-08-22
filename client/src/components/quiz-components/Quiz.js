import {useContext, useState} from "react";
import axios from "axios";
import {confirm} from "react-confirm-box";
import {QuizContext} from "./QuizContext";
import {UserContext} from "../UserContext";
import { useNavigate, useParams } from 'react-router-dom';
import QuizHeader from './quiz-subcomponents/QuizHeader';

export default () => {

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
        userAnswer : new Number(answerInput),
        correctAnswer : answeredQuestion.question.correctAnswer
      }
      const requestBody = {
        userName : credentials.userName,
        password : credentials.password,
        newAnswer
      }
      axios.post(`/user/${credentials._id}`, requestBody)
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
        cancellable: "Nevermind, I have a few questions in me"
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
        <p>{questionText}</p>
        {answers.map((answer, index) => {
          return (
            <div key={index}>
              <input 
                type="radio"
                value={index}
                checked={answerInput == index}
                name={"answerSelection"}
                onChange={handleAnswerSelect}
              />
              <span>{answer}</span>
            </div>
          )
        })}
      </div>
    )
  }

  return(
    <>
      {activeQuiz && 
        <div className="quizDetail">
          <QuizHeader quizName={activeQuiz.quizName} subject={activeQuiz.subject} />
          <div>
            <form onSubmit={submitAnswer}>
              {displayQuestion(questionIndex)}
              <button>Next Question</button>
              <button onClick={exitHandler}>Exit Quiz</button>  
            </form>
            <p>{messageText}</p>
          </div>
        </div>
      }
    </>
  )
}