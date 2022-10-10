import ScrollableListItem from "../../common-components/ScrollableListItem";
import ScrollableListEntry from "../../common-components/ScrollableListEntry";
const HistoricalQuizList = props => {
  const {sessionSummaries, setQuizSelection, togglePrevResults} = props;
  return (
    <>
      <p className="spacerText">Select a historical quiz below see your feedback</p>
      <div className="inactiveQuiz">
        {sessionSummaries.map(quiz => {
          const {dateTime, sessionId, correctAnswers, totalAnswers} = quiz;
          const dateTimeFormat = new Date(dateTime)
          const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
          ];
          const prettyDate = `${months[dateTimeFormat.getMonth()]} ${dateTimeFormat.getDate()}, ${dateTimeFormat.getFullYear()}`
          return (
            <ScrollableListItem key={sessionId} id={sessionId} onClick={setQuizSelection} >
              <ScrollableListEntry label={"Date Taken: "} value={prettyDate}/>
              <ScrollableListEntry label={"Score: "} value={prettyDate}/>
              <ScrollableListEntry label={""} value={`Answered ${correctAnswers} questions correctly out of ${totalAnswers} the attempted`} valueClassName={"emphasizedText"}/>
            </ScrollableListItem>
          );
        })}
      </div>
      <div className='btnContainer btnContainerSingle'>
        <button className="quizConfigPrevViewBtn colorBtn" onClick={togglePrevResults}>Back to Topic Selection</button>
      </div>
    </>
  );
};
export default HistoricalQuizList;