const QuizQuestionInput = (props) => {
  
  const {
    questionText, correctAnswer, 
    incorrectAnswer1, incorrectAnswer2, incorrectAnswer3,
    questionNumber,
  } = props.questionData;

  const {topicNumber, handleDeleteQuestion, handleQuestionChange} = props;

  
  return (
    <div className="inactiveQuestionContainer questionCreator">
      <p className="inactiveQuestionText">
        {`${questionNumber}.`}
        <textarea cols="100" rows="3" id={`${topicNumber}-${questionNumber}`} className="creatorInput" placeholder={"What is 2 + 2?"} name="questionText" value={questionText} onChange={handleQuestionChange} required></textarea>
      </p>
      <div className="answerCreatorContainer">
        <p className="answerCreatorGuideText">Correct Answer:</p>
        <textarea id={`${topicNumber}-${questionNumber}`} className="quizCreatorAnswerCorr" placeholder={"4"} name="correctAnswer" value={correctAnswer} onChange={handleQuestionChange} required></textarea>
        <p className="answerCreatorGuideText">Incorrect Answers:</p>
        <textarea id={`${topicNumber}-${questionNumber}`} className="quizCreatorAnswerIncorr" placeholder={"22"} name="incorrectAnswer1" value={incorrectAnswer1} onChange={handleQuestionChange} required></textarea>
        <textarea id={`${topicNumber}-${questionNumber}`} className="quizCreatorAnswerIncorr" placeholder={"8"} name="incorrectAnswer2" value={incorrectAnswer2} onChange={handleQuestionChange} required></textarea>
        <textarea id={`${topicNumber}-${questionNumber}`} className="quizCreatorAnswerIncorr" placeholder={"Not entirely sure..."} name="incorrectAnswer3" value={incorrectAnswer3} onChange={handleQuestionChange} required></textarea>
      </div>

      <div className="btnContainer btnContainerSingle noBorder">
        <input type="button" className="creatorBtn btnCaution" id={`${topicNumber}-${questionNumber}`} onClick={handleDeleteQuestion} value="Delete Question"/>
      </div>
    </div>
  )
}
export default QuizQuestionInput;