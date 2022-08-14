import React, {useState, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { AppContext } from '../AppContext';
import axios from "axios";

export default props => {

  const {userName, password} = props.credentials;
  const {quizData} = useContext(AppContext);
  const navigate = useNavigate();
  // get selected quizId from react-router's: url:
  const {quizId} = useParams();
  
  const filteredData = quizData.filter(quiz => quiz._id === quizId)
  const {quizName, subject} = filteredData[0];
  
  const [initTopicSelection] = filteredData
    .map(quiz => {
      return quiz.topics.map(topic => ({[topic.topicName] : true}));
    })
    
  const [selectedTopics, setSelectedTopics] = useState(initTopicSelection);
  
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
      userName, 
      password,
      quizId : quizId,
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
    
    axios.post("/quiz/" + quizConfiguration.quizId, quizConfiguration)
      .then(res => console.log(res.data))
      .catch(err => console.log(err))
  }

  const handleBack = () => {
    navigate("/menu/")
  }
  
  return(
    <>
      {}
      <div className='quizDetail'>
        <div className='quizDetailTitle'>
          <h2>{quizName}</h2>
          <h4>Subject: {subject}</h4>
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
    </>
  )
}