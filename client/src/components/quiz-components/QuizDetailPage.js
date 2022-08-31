import React, {useState, useContext, useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import Header from "../Header";
import QuizHeader from './quiz-subcomponents/QuizHeader';
import QuizConfigurationForm from './quiz-subcomponents/QuizConfigurationForm';
import HistoricalResults from './quiz-subcomponents/HistoricalResults';

import {QuizContext} from "./QuizContext";

const QuizDetailPage = () => {

  const {quizId} = useParams();
  const {setActiveQuiz} = useContext(QuizContext);

  // init navigate object
  const navigate = useNavigate();

  // init local state of QuizDetailPage
  const [prevResultsView, setPrevResultsView] = useState(false);
  const [quizDetails, setQuizDetails] = useState();
  const [selectedTopics, setSelectedTopics] = useState([]);

  useEffect(() => {
    // get quiz details:
    axios.get("/quiz/" + quizId)
      .then(res => {
        setQuizDetails(res.data)
        setSelectedTopics(res.data.topicSelections)
      })
      .catch(err => console.log(err))
  }, [quizId])

  const togglePrevResults = () => {
    setPrevResultsView(prevValue => !prevValue);
  }
  const toggleCheckbox = (e) => {
    const {name} = e.target;
    setSelectedTopics(
      selectedTopics.map(topic => {
        const [topicName] = Object.keys(topic);
        const [topicValue] = Object.values(topic);
        if (topicName === name) {
          return {[topicName] : !topicValue}
        } else {
          return {[topicName] : topicValue}
        }
      })
    )
  }
  const startQuiz = (e) => {
    e.preventDefault();
    const quizConfiguration = {
      selectedQuizId : quizId,
      includedTopics : selectedTopics
                        .filter(topic => {
                          const [value] = Object.values(topic);
                          return value;
                        })
                        .map(topic => {
                          const [name] = Object.keys(topic);
                          return name;
                        })
    }
    axios.post("/quiz/generate/" + quizConfiguration.selectedQuizId, quizConfiguration)
      .then(res => {
        setActiveQuiz(res.data)
      })
      .catch(err => console.log(err))
    navigate(`/quiz/active/${quizId}`)
  }
  const handleBack = () => {
    navigate("/menu/")
  }
  const quizConfigHandlers = {
    handleBack,
    startQuiz,
    toggleCheckbox,
    togglePrevResults
  }
  
  return(
    <main>
      <Header negateMetrics={true}/>
      <div> {/* Don't delete - required in order to ensure quizContainer fits screen properly */}
        <div className="quizContainer">
          {(quizDetails !== undefined && selectedTopics !== undefined) && 
            <div className='quizDetail'>
              <QuizHeader quizName={quizDetails.quizName} subject={quizDetails.subject}/>
              {!prevResultsView ?
                <QuizConfigurationForm quizId={quizId} selectedTopics={selectedTopics} quizConfigHandlers={quizConfigHandlers}/>
                : 
                <HistoricalResults quizId={quizId} togglePrevResults={togglePrevResults}/>
              }
            </div>
          }
        </div>
      </div>
    </main>
  )
}
export default QuizDetailPage;