const HistoricalQuizQuestion = props => {
  const {question, questionNumber} = props;
  
  const icon = (question.correctAnswer === question.userAnswer) ? 
                <img 
                  className="quizIcon"
                  alt={"Green check mark indicating correct answer"}
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
      <div className="inactiveQuestionContainer">
        <p className="inactiveQuestionText">{`${questionNumber}. `}{question.questionText}</p>
        <div>
          {question.answers.map((answer, index) => {
            const {correctAnswer, userAnswer} = question;
            const correctClassName = correctAnswer === index + "" ? "correctAnswer" : "incorrectAnswer";
            return <div key={index} className={`answerText inactiveAnswer ${correctClassName}`}>
                    {userAnswer === index + "" ? icon : <div className="iconPlaceholder"></div>}
                    <input type="radio" className={`quizIcon ${correctClassName}`} checked={userAnswer===index} disabled={true}/>
                    {<span className="inactiveAnswerText">{answer}</span>}
                  </div>
          })}
        </div>
      </div>
    </>
  )
}
export default HistoricalQuizQuestion;