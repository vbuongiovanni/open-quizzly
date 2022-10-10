import { useState, useContext, useEffect} from "react";
import {AppContext} from "./../../../context/AppContext";
import HistoricalQuizList from "./HistoricalQuizList";
import HistoricalQuizDetail from "./HistoricalQuizDetail";

const HistoricalResults = props => {
  const {quizId} = props;

  const {getUserQuizResults} = useContext(AppContext);

  const [results, setResults] = useState({sessionResults : [], sessionSummaries : []});
  const [selectedSessionId, setSessionId] = useState(null);

  useEffect(() => {
    getUserQuizResults(quizId, setResults);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quizId]);
    
  const togglePrevResults = props.togglePrevResults;
  const renderQuestions = results.sessionResults.filter(session => session.sessionId === selectedSessionId);

  // Display detailed <HistoricalQuizDetail/> of a specific quiz
  const handleQuizSelect = (e) => {
    const id = `${e.target.id}${e.target.parentElement.id}${e.target.parentElement.parentElement.id}`
    setSessionId(id);
  };

  // Exit detailed <HistoricalQuizDetail/> of a specific quiz 
  const handleExitQuizReview = () => {
    setSessionId(null)
  };

  return (
    <div className="histQuizContainer">
      {selectedSessionId === null ? 
        <HistoricalQuizList sessionSummaries={results.sessionSummaries} selectedSessionId={selectedSessionId} handleQuizSelect={handleQuizSelect} togglePrevResults={togglePrevResults}/> :
        <HistoricalQuizDetail renderQuestions={renderQuestions} handleExitQuizReview={handleExitQuizReview}/>
      }
    </div>
  );
};
export default HistoricalResults;