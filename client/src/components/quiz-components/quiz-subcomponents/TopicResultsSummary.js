const TopicResultsSummary = props => {
  const {histPerformance} = props;
  
  const rankTopics = (histPerformance) => {
    return histPerformance.sort((a, b) => a.percentCorrect < b.percentCorrect ? 1 : -1)
          .map((element, index) => {
            const className = index === 0 ? "best" : index === (histPerformance.length - 1) ? "worst" : ""
            return <p className={className} key={index}>{element.topicName}: {element.percentCorrect * 100}% Correct</p>
          })
  }

  return (
    <>
      {rankTopics(histPerformance)}
    </>
  )
}
export default TopicResultsSummary;