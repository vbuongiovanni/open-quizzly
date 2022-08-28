import HistoricalQuizQuestion from "./HistoricalQuizQuestion";

const HistoricalQuizDetail = props => {
  const {renderQuestions, handleExitQuizReview} = props;
  return (
    <>
      <div className="histQuiz">
        {renderQuestions.questions.map((question, index) => {
          return <HistoricalQuizQuestion key={index} question={question} questionNumber={index+1}/>
        })}
      </div>
      <button onClick={handleExitQuizReview}>Exit Quiz Review</button>
    </>
  )
}
export default HistoricalQuizDetail;