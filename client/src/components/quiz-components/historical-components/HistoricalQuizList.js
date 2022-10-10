const HistoricalQuizList = props => {
  const {sessionSummaries, handleQuizSelect, togglePrevResults} = props;
  return (
    <>
      <p className="spacerText">Select a historical quiz below see your feedback</p>
      <div className="inactiveQuiz">
        {sessionSummaries.map(quiz => {
          const {dateTime, sessionId, correctAnswers, percentCorrect, totalQuestions} = quiz;
          const dateTimeFormat = new Date(dateTime)
          const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
          ];
          const prettyDate = `${months[dateTimeFormat.getMonth()]} ${dateTimeFormat.getDate()}, ${dateTimeFormat.getFullYear()}`
          return (
            <div key={sessionId} id={sessionId} onClick={handleQuizSelect} className="histQuizListItem btn">
              <p className="histQuizListItem__pair histQuizListItem__text">
                <span className="histQuizListItem__label">Date Taken: </span>
                <span>{prettyDate}</span>
              </p>
              <p className="histQuizListItem__pair histQuizListItem__text">
                <span className="histQuizListItem__label">Score: </span>
                <span>{percentCorrect}%</span>
              </p>
              <p className="emphasizedText histQuizListItem__text">
                Answered {correctAnswers} questions correctly out of {totalQuestions} the attempted
              </p>
            </div>
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