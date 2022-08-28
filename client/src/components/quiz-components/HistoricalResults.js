import { useState } from "react";
import HistoricalQuizList from "./quiz-subcomponents/HistoricalQuizList";
import HistoricalQuizDetail from "./quiz-subcomponents/HistoricalQuizDetail";

const HistoricalResults = props => {
  const {results} = props.credentials;
  const togglePrevResults = props.togglePrevResults;
  
  const sessionSet = new Set(results.map(session => session.sessionId))
  let quizGrouping = [];

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
  quizGrouping = quizGrouping.sort((a, b) => a.dateTime < b.dateTime ? 1 : -1)

  const renderQuestions = quizGrouping.find(session => session.sessionId === selectedSessionId)

  // Display detailed <HistoricalQuizDetail/> of a specific quiz
  const handleQuizSelect = (e) => {
    const id = `${e.target.id}${e.target.parentElement.id}${e.target.parentElement.parentElement.id}`
    setSessionId(id);
  }

  // Exit detailed <HistoricalQuizDetail/> of a specific quiz 
  const handleExitQuizReview = () => {
    setSessionId(null)
  }

  return (
    <div className="histQuizContainer">
      {selectedSessionId === null ? 
        <HistoricalQuizList quizGrouping={quizGrouping} selectedSessionId={selectedSessionId} handleQuizSelect={handleQuizSelect} togglePrevResults={togglePrevResults}/> :
        <HistoricalQuizDetail renderQuestions={renderQuestions} handleExitQuizReview={handleExitQuizReview}/>
      }
    </div>
  )
}
export default HistoricalResults;