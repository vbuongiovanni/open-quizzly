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
      <div className='btnContainer btnContainerSingle'>
        <button className="togglePrevBtn colorBtn" onClick={handleExitQuizReview}>Exit Quiz Review</button>
      </div>
    </>
  )
}
export default HistoricalQuizDetail;