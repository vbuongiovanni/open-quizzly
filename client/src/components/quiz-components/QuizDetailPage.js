import React, {useEffect, useState} from 'react';
import axios from "axios";
function  QuizDetailPage(props)  {

  const [selectedTopics, setSelectedTopics] = useState();

  // stand-in code until context/router is set up vvv
  const [quizData, setQuizData] = useState([]);
  useEffect(() => {
    const getQuizData = async () => {
      const res = await axios.get("quiz/")
        .catch(err => console.log(err))
      if (res !== undefined) {
        const data = await res.data;
        const [quizOfInterest] = data.filter(quiz => quiz._id === props.selectedQuiz);
        setQuizData(quizOfInterest);
        setSelectedTopics(quizOfInterest.topics.map(topic => ({[topic.topicName] :  true})))
      }
    }
    getQuizData();
  }, [])
  // stand-in code until context/router is set up ^^^
  
  const {quizName, subject, topics} = quizData;
  
  const toggleCheckbox = (e) => {
    const {name, checked} = e.target;
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
          selectedTopics && selectedTopics.map(topic => {
          const [name] = Object.keys(topic);
          const [value] = Object.values(topic);
          return (
                  <div className="quizConfigCheckBoxRow">
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