import React, {useState, useContext, useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import Header from "../Header";
import QuizHeader from './quiz-subcomponents/QuizHeader';
import TopicResultsSummary from './quiz-subcomponents/TopicResultsSummary';
import {QuizContext} from "./QuizContext";
import {UserContext} from "../UserContext";
import {AppContext} from "../AppContext";

export default props => {

  const {quizId} = useParams();
  const {quizData} = useContext(AppContext);
  const {credentials} = useContext(UserContext);
  const {setActiveQuiz} = useContext(QuizContext);

  // init navigate object
  const navigate = useNavigate();

  // init local state of QuizDetailPage
  const [quizDetails, setQuizDetails] = useState();
  const [prevResultsView, setPrevResultsView] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [histPerformance, setHistPerformance] = useState([]);

  useEffect(() => {
    // get quiz details:
    axios.get("/quiz/" + quizId)
      .then(res => {
        setQuizDetails(res.data)
        setSelectedTopics(res.data.topicSelections)
      })
      .catch(err => console.log(err))
    // get historical performance of quiz:
    axios.get(`/user/history/${credentials._id}?quizId=${quizId}`)
      .then(res => {
        console.log(res.data)
        setHistPerformance(res.data)
      })
      .catch(err => console.log(err))
  }, [])

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
  
  return(
    <main>
      <Header negateMetrics={true}/>
      <div> {/*
        Don't delete this div - 
        it is required in order to ensure quizContainer fits screen properly 
      */}
        <div className="quizContainer">
          {(quizDetails !== undefined && selectedTopics !== undefined) && 
            <div className='quizDetail'>
              <QuizHeader quizName={quizDetails.quizName} subject={quizDetails.subject}/>
              <TopicResultsSummary histPerformance={histPerformance}/>
              <div className='quizDetailResultsBtnContainer'>
                <button>See Detail Previous Results</button>
              </div>
              <form className='quizConfig' onSubmit={startQuiz}>
                <p>Select the topics you would like to be included in the quiz:</p>
                {
                  selectedTopics.map((topic, index) => {
                    const [name] = Object.keys(topic);
                    const [value] = Object.values(topic);
                    return (
                            <div key={index} className="quizConfigCheckBoxRow">
                              <input 
                                type="checkbox"
                                onChange={toggleCheckbox}
                                name={name}
                                checked={value}
                              />
                              <label htmlFor={name}>{name}</label>
                            </div>
                          )
                  })
                }
                <div className='quizConfigButtonContainer'>
                  <button onClick={handleBack}>Back</button>
                  <button>Start quiz</button>
                </div>
              </form>
            </div>
          }
        </div>
      </div>
    </main>
  )
}