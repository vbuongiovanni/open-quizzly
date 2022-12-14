import {useContext, useState} from "react";
import { useParams } from 'react-router-dom';
import ConfirmMsg from "../common-components/ConfirmMsg";
import {QuizContext} from "../../context/QuizContext";
import {AppContext} from "../../context/AppContext";
import Header from "../Header";
import QuizHeader from './quiz-subcomponents/QuizHeader';

const Quiz = () => {

  const {activeQuiz} = useContext(QuizContext);
  const {postAnswer, navCallbacks : {navToMenu}} = useContext(AppContext);
  
  const {quizId} = useParams();

  const [questionIndex, setQuestionIndex] = useState(0)
  const [answerInput, setAnswerInput] = useState(null);
  const [messageText, setMessageText] = useState("");

  const [inConfirmPopup, setInConfirmPopup] = useState(false);
  const [confirmMsgOptions, setConfirmMsgOptions] = useState({});

  const handleAnswerSelect = e => {
    const {value, id} = e.target
    setAnswerInput(value === undefined ? id : value)
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
        userAnswer : parseInt(answerInput),
        correctAnswer : answeredQuestion.question.correctAnswer
      }
      const requestBody = {
        newAnswer
      }
      // post answer
      postAnswer(requestBody);
      // if user is on final question, navigate to main, otherwise iterate index val
      if (questionIndex + 1 === activeQuiz.shuffledQuestions.length) {
        navToMenu();
      } else {
        setQuestionIndex(prevIndex => prevIndex + 1);
        setAnswerInput(null)
      }
    }
  }
  
  // functions to 1) handle the click of sub-button on form and 
  // 2) uses a confirmation box to dictate whether or not to exit
  const handleQuizExit = () => {
    setConfirmMsgOptions({
      text : "Are you sure you want to exit the quiz?",
      confirmText : "Yes",
      denyText : "No",
      onAcceptCallback : () => navToMenu(),
      setInConfirmPopup : setInConfirmPopup
    });
    setInConfirmPopup(true);
  };
  
  // function to return question component, given an index number
  const displayQuestion = (questionNumber) => {
    const {questionText, answers} = activeQuiz.shuffledQuestions[questionNumber].question;
    const {topicName} = activeQuiz.shuffledQuestions[questionNumber];
    return (
      <div>
        <p className="questionText" id={topicName}>{questionText}</p>
        {answers.map((answer, index) => {
          return (
            <div id={index} onClick={handleAnswerSelect} className="questionContainer" key={index}>
              <div className="questionInputContainer">
                <input 
                  className="radioInput questionTextContainerClickable"
                  type="radio"
                  value={index}
                  checked={parseInt(answerInput) === index}
                  name={"answerSelection"}
                  onChange={handleAnswerSelect}
                />
              </div>
              <div id={index} onClick={handleAnswerSelect} className="questionTextContainer questionTextContainerClickable">
                <p id={index} onClick={handleAnswerSelect}  className="answerText">{answer}</p>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return(
    <>
      {inConfirmPopup && <ConfirmMsg options={confirmMsgOptions}/>}
      <Header negateMetrics={true}/>
      <main>
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
                    <div className="quizFormProgressBarContainer">
                      <div className="quizFormProgressBar">
                        {activeQuiz.shuffledQuestions.map((question, index) => <div className={`quizFormProgressBarBlock ${questionIndex > index ? " activeBlock" : ""}`} key={index}></div>)}
                      </div>
                    </div>
                    <div className="btnContainer btnContainerDual">
                      <button className="quizNavBtn cautionBtn" onClick={handleQuizExit}>Exit Quiz</button>  
                      <button className="quizNavBtn colorBtn">
                        {questionIndex === (activeQuiz.shuffledQuestions.length - 1) ? "Finish" : 
                          "Next Question"}
                      </button>
                    </div>
                    <p className="userMessage">{messageText}</p>
                  </form>
              </div>
            }
          </div>
        </div>
      </main>
    </>
  )
}
export default Quiz;