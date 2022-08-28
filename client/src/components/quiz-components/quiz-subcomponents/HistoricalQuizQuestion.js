const HistoricalQuizQuestion = props => {
  const {question, questionNumber} = props;
  
  const icon = (question.correctAnswer === question.userAnswer) ? 
                <img 
                  className="quizIcon"
                  alt={"Green checkmark indicating correct answer"}
                  src={require("./quiz-resources/icon-correct.png")}
                />
                : 
                <img
                  className="quizIcon"
                  alt={"red X mark indicating incorrect answer"}
                  src={require("./quiz-resources/icon-incorrect.png")}
                />;
  return (
    <>
      <div className="histQuestionContainer">
        <p className="histQuestionText">{`${questionNumber}. `}{question.questionText}</p>
        <div className="histQuestionTextContainer">
          {question.answers.map((answer, index) => {
            const correctClassName = question.correctAnswer === index ? "correctAnswer" : "incorrectAnswer";
            return <div className={`answerText histAnswer ${correctClassName}`}>
                    {question.userAnswer === index ? icon : <div className="iconPlaceholder"></div>}
                    <input type="radio" className={`quizIcon ${correctClassName}`} checked={question.userAnswer===index} disabled={true}/>
                    {<span className="histAnswerText">{answer}</span>}
                  </div>
          })}
        </div>
      </div>
    </>
  )
}
export default HistoricalQuizQuestion;