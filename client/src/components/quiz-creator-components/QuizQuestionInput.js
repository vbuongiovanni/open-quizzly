import {useState} from "react";
import { timedUserMsg } from "../../modules/timedUserMsg";
const QuizQuestionInput = (props) => {
  
  const {
    topicNumber,
    handleDeleteQuestion,
    handleQuestionChange,
    numQuestions,
    questionData : {
      questionText, correctAnswer, 
      incorrectAnswer1, incorrectAnswer2, incorrectAnswer3,
      questionNumber,
    }
  } = props;

  const [messageText, setMessageText] = useState("");
  
  const handleUserMessage = (e) => {
    timedUserMsg("Each topic must have at least 1 question.", setMessageText);
  };
  
  return (
    <div className="inactiveQuestionContainer questionCreator">
      <p className="inactiveQuestionText">
        {`${questionNumber}.`}
        <textarea cols="100" rows="3" id={`${topicNumber}-${questionNumber}`} className="creatorInput" placeholder={"What is 2 + 2?"} name="questionText" value={questionText} onChange={handleQuestionChange} required></textarea>
      </p>
      <div className="answerCreatorContainer">
        <p className="answerCreatorGuideText">Correct Answer:</p>
        <textarea id={`${topicNumber}-${questionNumber}`} className="quizCreatorAnswerCorr creatorInput" placeholder={"4"} name="correctAnswer" value={correctAnswer} onChange={handleQuestionChange} required></textarea>
        <p className="answerCreatorGuideText">Incorrect Answers:</p>
        <textarea id={`${topicNumber}-${questionNumber}`} className="quizCreatorAnswerIncorr creatorInput" placeholder={"22"} name="incorrectAnswer1" value={incorrectAnswer1} onChange={handleQuestionChange} required></textarea>
        <textarea id={`${topicNumber}-${questionNumber}`} className="quizCreatorAnswerIncorr creatorInput" placeholder={"8"} name="incorrectAnswer2" value={incorrectAnswer2} onChange={handleQuestionChange} required></textarea>
        <textarea id={`${topicNumber}-${questionNumber}`} className="quizCreatorAnswerIncorr creatorInput" placeholder={"Not entirely sure..."} name="incorrectAnswer3" value={incorrectAnswer3} onChange={handleQuestionChange} required></textarea>
      </div>
      <div className="questionDeleteContainer">
        {!(numQuestions <= 1) ? 
          <input type="button" className="creatorBtn btn cautionBtn colorBtn" id={`${topicNumber}-${questionNumber}`} onClick={handleDeleteQuestion} value={`Delete Question ${questionNumber}`}/> :
          <input type="button" className="creatorBtn btn deactivatedBtn" id={`${topicNumber}-${questionNumber}`} onClick={handleUserMessage} value={`Delete Question ${questionNumber}`}/>
        }
      </div>
      <p className="userMessage emphasizedText quizCreatorFormMessage">{messageText}</p>
    </div>
  );
};
export default QuizQuestionInput;