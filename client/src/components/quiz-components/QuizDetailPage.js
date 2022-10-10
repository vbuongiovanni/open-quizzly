import React, {useState, useContext, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import {AppContext} from "./../../context/AppContext";
import {QuizContext} from "./../../context/QuizContext";
import Header from "../Header";
import QuizHeader from './quiz-subcomponents/QuizHeader';
import QuizConfigurationForm from './quiz-subcomponents/QuizConfigurationForm';
import HistoricalResults from './historical-components/HistoricalResults';

const QuizDetailPage = () => {

  const {quizId} = useParams();
  const {getQuizDetails, generateQuiz, navCallbacks : {navToMenu, navToActiveQuiz}} = useContext(AppContext);
  const {setActiveQuiz} = useContext(QuizContext);

  // init local state of QuizDetailPage
  const [prevResultsView, setPrevResultsView] = useState(false);
  const [quizDetails, setQuizDetails] = useState();
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    // get quiz details:
    getQuizDetails(quizId, setQuizDetails, setSelectedTopics)
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // check to see if there is at least 1 input selected:
    const isValid = selectedTopics.map(inputValue => Object.values(inputValue)[0] === true).includes(true);
    if (isValid) {
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
      generateQuiz(quizId, setActiveQuiz, quizConfiguration);
      navToActiveQuiz(quizId);
    } else {
      setMessageText("Please select at least one topic.")
    }
  }

  const quizConfigHandlers = {
    navToMenu,
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
            <p className="userMessage">{messageText}</p>
            </div>
          }
        </div>
      </div>
    </main>
  )
}
export default QuizDetailPage;