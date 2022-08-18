import {useContext, useState, useEffect} from "react";
import {QuizContext} from "../QuizContext";
import {UserContext} from "../UserContext";
import { useNavigate, useParams } from 'react-router-dom';
import QuizHeader from './quiz-subcomponents/QuizHeader';
import axios from "axios";

export default () => {

  const {activeQuiz} = useContext(QuizContext);
  const {credentials} = useContext(UserContext);
  
  const {quizId} = useParams();

  const [questionIndex, setQuestionIndex] = useState(0)
  const [answerInput, setAnswerInput] = useState("");

  const navigate = useNavigate();

  const handleAnswerSelect = e => {
    setAnswerInput(e.target.value)
    console.log(e.target.value)
  }

  const submitAnswer = e => {
    e.preventDefault();
    const answeredQuestion = activeQuiz.shuffledQuestions[questionIndex]
    console.log(answeredQuestion)
    const newAnswer = {
      quizId,
      answers : answeredQuestion.question.answers,
      topicName : answeredQuestion.topicName,
      questionText : answeredQuestion.question.questionText, 
      userAnswer : answerInput,
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
              <button>Next</button>
              <button>Exit</button>
            </form>
          </div>
        </div>
      }
    </>
  )
}