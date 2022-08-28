const HistoricalQuizList = props => {
  const {quizGrouping, handleQuizSelect, togglePrevResults} = props;

  return (
    <>
    
      <div className="histQuiz">
        {quizGrouping.map(quiz => {
          const [dayName, monthName] = quiz.dateTime.toString().split(" ");
          const prettyDate = `${dayName} ${monthName} ${quiz.dateTime.getDate()}, ${quiz.dateTime.getFullYear()}`
          return (
            <div key={quiz.sessionId} id={quiz.sessionId} onClick={handleQuizSelect} className="histQuizListItem">
              <p className="histQuizListItem__pair histQuizListItem__text">
                <span className="histQuizListItem__label">Quiz Name: </span>
                <span>{quiz.quizId}</span>
              </p>
              <p className="histQuizListItem__pair histQuizListItem__text">
                <span>{prettyDate}</span>
              </p>
              <p className="histQuizListItem__pair histQuizListItem__text">
                <span className="histQuizListItem__label">Score: </span>
                <span>{quiz.score}%</span>
              </p>
              <p className="emphasizedText histQuizListItem__text">
                Answered {quiz.correctAnswers} questions correctly out of {quiz.totalQuestions} attempted
              </p>
            </div>
          )
        })}
      </div>
      <button onClick={togglePrevResults}>Back to Topic Selection</button>
    </>
  )
}
export default HistoricalQuizList;