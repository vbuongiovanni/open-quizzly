import React, {useEffect, useState, useContext} from 'react';
import { AppContext } from '../AppContext';

function QuizDetailPage(props)  {

  const {quizData} = useContext(AppContext)
  
  const {quizName, subject} = quizData;
  
  const [initTopicSelection] = quizData
    .filter(quiz => quiz._id === props.selectedQuiz)
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
      quizId : props.selectedQuiz,
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
    console.log(quizConfiguration)
  }
  
  return(
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
          <button onClick={() => props.handleBack()}>Back</button>
          <button>Start quiz</button>
        </div>
      </form>
    </div>
  )
}
export default QuizDetailPage