import {useEffect, useState, useContext} from "react";
import {UserContext} from "./../../../context/UserContext";
import {AppContext} from "./../../../context/AppContext";
import TopicResultsSummary from "./TopicResultsSummary";

const QuizConfigurationForm = props => {
  const {quizId, selectedTopics, quizConfigHandlers} = props;
  const {startQuiz, toggleCheckbox, togglePrevResults, navToMenu} = quizConfigHandlers;

  const {getUserQuizPerformance} = useContext(AppContext);


  const {credentials} = useContext(UserContext);
  const {_id : userId} = credentials;

  const [histPerformance, setHistPerformance] = useState([]);

  useEffect(() => {
    // get historical performance of quiz:
    getUserQuizPerformance(quizId, setHistPerformance)
  }, [userId, quizId])

  return (
    <>
      <TopicResultsSummary histPerformance={histPerformance}/>
      <div className='quizDetailResultsBtnContainer'>
        {
          histPerformance.length !== 0 ? 
          <button className="quizConfigPrevViewBtn colorBtn" onClick={togglePrevResults}>See historical Results</button> : 
          <button className="quizConfigPrevViewBtn deactivatedBtn" onClick={() => {}}>See historical Results</button>
        }
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
          <button className="colorBtn quizConfigBtn" onClick={navToMenu}>Back</button>
          <button className="colorBtn quizConfigBtn" >Start Quiz</button>
        </div>
      </form>
    </>
  )
}
export default QuizConfigurationForm;