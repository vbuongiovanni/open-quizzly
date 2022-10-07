const TopicResultsSummary = props => {
  const {histPerformance} = props;
  
  const rankTopics = (histPerformance) => {
    return histPerformance.map((element, index) => 
      <p 
        key={index}
        className={index === 0 ? "best" : index === (histPerformance.length - 1) ? "worst" : ""} >
          {element.topic}: {element.percentCorrect}% Correct
      </p>
    )
  }
  return (
    <>
      {rankTopics(histPerformance)}
    </>
  )
}
export default TopicResultsSummary;