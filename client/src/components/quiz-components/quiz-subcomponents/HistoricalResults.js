import { useState, useContext, useEffect} from "react";
import {UserContext} from "../../UserContext";
import axios from "axios";
import HistoricalQuizList from "./HistoricalQuizList";
import HistoricalQuizDetail from "./HistoricalQuizDetail";

const HistoricalResults = props => {
  const {quizId} = props

  const {credentials} = useContext(UserContext);
  const {userName, password, userId} = credentials;

  const [results, setResults] = useState([])

  // fetch and set state of 'results' from backend.
  useEffect(() => {
    const requestBody = {
      userName : userName,
      password : password,
    }
    axios.post("/user/summary/" + userId, requestBody)
      .then(res => setResults(res.data.results))
      .catch(err => console.log(err))
  }, [userName, userId, password])

  const togglePrevResults = props.togglePrevResults;
  
  const sessionSet = new Set(results.filter(result => result.quizId === quizId).map(session => session.sessionId))
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