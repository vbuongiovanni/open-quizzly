import { useState, useContext, useEffect} from "react";
import {AppContext} from "./../../../context/AppContext";
import HistoricalQuizList from "./HistoricalQuizList";
import HistoricalQuizDetail from "./HistoricalQuizDetail";

const HistoricalResults = props => {
  const {quizId} = props

  const {getUserQuizResults} = useContext(AppContext);

  const [results, setResults] = useState({sessionResults : [], sessionSummaries : []})

  // fetch and set state of 'results' from backend.
  useEffect(() => {
    getUserQuizResults(quizId, setResults)
    // axios.post("/user/summary/" + userId, requestBody)
    //   .then(res => setResults(res.data.results))
    //   .catch(err => console.log(err))
    }, [])
    
  const togglePrevResults = props.togglePrevResults;
  
  // const sessionSet = new Set(results.filter(result => result.quizId === quizId).map(session => session.sessionId))
  // let quizGrouping = [];

  const [selectedSessionId, setSessionId] = useState(null)

  // for (let sessionId of sessionSet) {
  //   const [year, month, day, hour, minute] = sessionId.split("_")

  //   const questions = results.filter(result => result.sessionId === sessionId);
  //   const correctAnswers = questions.reduce((prev, curr) => prev + (curr.userAnswer === curr.correctAnswer ? 1 : 0), 0)
  //   const totalQuestions = questions.length

  //   const {quizId, quizName} = results.find(result => result.sessionId === sessionId);

  //   quizGrouping.push({
  //     sessionId,
  //     correctAnswers,
  //     totalQuestions,
  //     score : Math.round((correctAnswers / totalQuestions) * 10000)/100,
  //     questions : questions,  
  //     quizId,
  //     quizName,
  //     dateTime : new Date(year, month, day, hour, minute)
  //   })
  // }
  // quizGrouping = quizGrouping.sort((a, b) => a.dateTime < b.dateTime ? 1 : -1)

  const renderQuestions = results.sessionResults.filter(session => session.sessionId === selectedSessionId)

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
        <HistoricalQuizList sessionSummaries={results.sessionSummaries} selectedSessionId={selectedSessionId} handleQuizSelect={handleQuizSelect} togglePrevResults={togglePrevResults}/> :
        <HistoricalQuizDetail renderQuestions={renderQuestions} handleExitQuizReview={handleExitQuizReview}/>
      }

    </div>
  )
}
export default HistoricalResults;