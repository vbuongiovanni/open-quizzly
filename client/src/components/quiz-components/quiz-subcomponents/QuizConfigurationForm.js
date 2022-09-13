import {useEffect, useState, useContext} from "react";
import axios from "axios";
import {UserContext} from "../../UserContext";
import TopicResultsSummary from "./TopicResultsSummary";

const QuizConfigurationForm = props => {
  const {quizId, selectedTopics, quizConfigHandlers} = props;
  const {handleBack, startQuiz, toggleCheckbox, togglePrevResults} = quizConfigHandlers;

  const {credentials} = useContext(UserContext);
  const {_id : userId} = credentials;

  const [histPerformance, setHistPerformance] = useState([]);

  useEffect(() => {
    // get historical performance of quiz:
    axios.get(`/user/history/${userId}?quizId=${quizId}`)
      .then(res => {
        setHistPerformance(res.data)
      })
      .catch(err => console.log(err))
  }, [userId, quizId])

  return (
    <>
      <TopicResultsSummary histPerformance={histPerformance}/>
      <div className='quizDetailResultsBtnContainer'>
        <button className="quizConfigPrevViewBtn colorBtn" onClick={togglePrevResults}>See historical Results</button>
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
        <div className='btnContainer btnContainerDual'>
          <button className="colorBtn quizConfigBtn" onClick={handleBack}>Back</button>
          <button className="colorBtn quizConfigBtn" >Start Quiz</button>
        </div>
      </form>
    </>
  )
}
export default QuizConfigurationForm;