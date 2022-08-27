import { useState } from "react";
import QuizHeader from "./quiz-subcomponents/QuizHeader";
export default (props) => {
  const {results} = props.credentials;
  const togglePrevResults = props.togglePrevResults;
  
  const sessionSet = new Set(results.map(session => session.sessionId))
  const quizGrouping = [];

  const [selectedSessionId, setSessionId] = useState(null)

  for (let sessionId of sessionSet) {
    const [year, month, day, hour, minute] = sessionId.split("_")
    const questions = results.filter(result => result.sessionId === sessionId);
    
    const correctAnswers = questions.reduce((prev, curr) => prev + (curr.userAnswer === curr.correctAnswer ? 1 : 0), 0)
    const totalQuestions = questions.length

    quizGrouping.push({
      sessionId,
      correctAnswers,
      totalQuestions,
      score : Math.round((correctAnswers / totalQuestions) * 10000)/100,
      questions : questions,  
      quizId : results.find(result => result.sessionId === sessionId).quizId,
      dateTime : new Date(year, month, day, hour, minute)
    })
  }

  // enter a quiz review
  const handleQuizSelect = (e) => {
    const id = `${e.target.id}${e.target.parentElement.id}${e.target.parentElement.parentElement.id}`
    setSessionId(id);
  }
  
  // exit out of a quiz review
  const handleExitQuizReview = () => {
    setSessionId(null)
  }

  const renderHistory = (selectedSessionId) => {
    if (selectedSessionId === null) {
      return (
        <div className="historicalQuizMenu">
            <div className="historicalQuizCardContainer">
              {quizGrouping.sort((a, b) => a.dateTime < b.dateTime ? 1 : -1).map(quiz => {
                const [dayName, monthName] = quiz.dateTime.toString().split(" ");
                const prettyDate = `${dayName} ${monthName} ${quiz.dateTime.getDate()}, ${quiz.dateTime.getFullYear()}`
                return (
                  <div key={quiz.sessionId} id={quiz.sessionId} onClick={handleQuizSelect} className="historicalQuizCard">
                    <p className="historicalQuizCard__pair historicalQuizCard__text">
                      <span className="historicalQuizCard__label">Quiz Name: </span>
                      <span>{quiz.quizId}</span>
                    </p>
                    <p className="historicalQuizCard__pair historicalQuizCard__text">
                      <span>{prettyDate}</span>
                    </p>
                    <p className="historicalQuizCard__pair historicalQuizCard__text">
                      <span className="historicalQuizCard__label">Score: </span>
                      <span>{quiz.score}%</span>
                    </p>
                    <p className="emphasizedText historicalQuizCard__text">
                      Answered {quiz.correctAnswers} questions correctly out of {quiz.totalQuestions} attempted
                    </p>
                  </div>
                )
              })}
            </div>
          <button onClick={togglePrevResults}>Back to Topic Selection</button>
        </div>
      )
    } else {
      const renderQuestions = quizGrouping.find(session => session.sessionId === selectedSessionId)
      console.log(renderQuestions)
      return (
        <div className="historicalQuizMenu">
          <button onClick={handleExitQuizReview}>Exit Quiz Review</button>
          <div className="historicalQuiz">
            {renderQuestions.questions.map((question, index) => {
              const icon = (question.correctAnswer === question.userAnswer) ? 
                <img className="quizIcon" src={require("./quiz-resources/icon-correct.png")}/> : 
                <img className="quizIcon" src={require("./quiz-resources/icon-incorrect.png")}/>;
              return (
                  <div className="historicalQuestionContainer">
                    <p className="historicalQuestionText">{`${index + 1}. `}{question.questionText}</p>
                    <div className="historicalQuestionTextContainer">
                      {question.answers.map((answer, index) => {
                        const correctClassName = question.correctAnswer === index ? "correctAnswer" : "incorrectAnswer";
                        return <div className={`answerText historicalAnswer ${correctClassName}`}>
                                {question.userAnswer === index ? icon : <div className="iconPlaceholder"></div>}
                                <input type="radio" classname={`quizIcon ${correctClassName}`} checked={question.userAnswer===index} disabled="true"/>
                                {<span className="historicalAnswerText">{answer}</span>}
                              </div>
                      })}
                    </div>
                  </div>
              )
            })}
          </div>
          <button onClick={handleExitQuizReview}>Exit Quiz Review</button>
        </div>
      )
    }
  }

  

  return (
    <div className="quizResultsContainer">
      {renderHistory(selectedSessionId)}
    </div>
  )
}