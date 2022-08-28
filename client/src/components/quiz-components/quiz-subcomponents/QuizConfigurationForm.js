import TopicResultsSummary from "./TopicResultsSummary"

const QuizConfigurationForm = props => {
  const {histPerformance, selectedTopics} = props;
  const {handleBack, startQuiz, toggleCheckbox, togglePrevResults} = props.quizConfigHandlers;

  return (
    <>
      <TopicResultsSummary histPerformance={histPerformance}/>
      <div className='quizDetailResultsBtnContainer'>
                    <button onClick={togglePrevResults}>See historical Results</button>
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
                        <button>Start Quiz</button>
                      </div>
                    </form>
    </>
  )
}
export default QuizConfigurationForm;