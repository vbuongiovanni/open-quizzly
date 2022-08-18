import React, {useState, useContext, useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import QuizHeader from './quiz-subcomponents/QuizHeader';
import {QuizContext} from "../QuizContext";
import {AppContext} from "../AppContext";

export default props => {

  const {quizId} = useParams();
  const {quizData} = useContext(AppContext);
  const {setActiveQuiz} = useContext(QuizContext);

  // init navigate object
  const navigate = useNavigate();

  // init local state of QuizDetailPage
  const [quizDetails, setQuizDetails] = useState();
  const [selectedTopics, setSelectedTopics] = useState([]);

  useEffect(() => {
    axios.get("/quiz/" + quizId)
      .then(res => {
        setQuizDetails(res.data)
        setSelectedTopics(res.data.topicSelections)
      })
      .catch(err => console.log(err))
  }, [])

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
        console.log(res.data)
        setActiveQuiz(res.data)
      })
      .catch(err => console.log(err))

    navigate(`/quiz/active/${quizId}`)
  }

  const handleBack = () => {
    navigate("/menu/")
  }
  
  return(
    <>
      {(quizDetails !== undefined && selectedTopics !== undefined) && 
      <div className='quizDetail'>
        <QuizHeader quizName={quizDetails.quizName} subject={quizDetails.subject}/>
        <div className='quizDetailResultsBtnContainer'>
          <button>See Previous Results</button>
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
    </>
  )
}