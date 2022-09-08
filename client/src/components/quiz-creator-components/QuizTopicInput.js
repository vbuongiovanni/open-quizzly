import {useState} from "react";
import QuizQuestionInput from "./QuizQuestionInput";

const QuizTopicInput = (props) => {
  const {topicData, createNewTopic, numTopics, handleDeleteTopic, handleTopicChange, handleNewQuestion, handleDeleteQuestion, handleQuestionChange} = props;
  const {topicNumber, topicName, questions} = topicData;

  const [messageText, setMessageText] = useState("");

  const isDeleteDeactivated = numTopics <= 1

  // handler to post message if deactivated button is pressed
  const handleUserMessage = (e) => {
    setMessageText("There must be at least 1 topic.")
    setInterval(() => {
      setMessageText("")
    }, 5000)
  }

  return (
    <div className="topicCreatorContainer">
      <p className="topicNameText">
        {`Topic ${topicNumber}`} - <input type="text" id={topicNumber} className="creatorInput" placeholder="Addition" onChange={handleTopicChange} value={topicName} name="topicName" required/>
      </p>
      <div className="questionCreatorContainer">
        {questions.map((question, index) => <QuizQuestionInput key={index} numQuestions={questions.length} topicNumber={topicNumber} questionData={question} handleDeleteQuestion={handleDeleteQuestion} handleQuestionChange={handleQuestionChange}/>)}
      </div>
      <div className="btnContainer btnContainerDual noBorder">
        <input type="button" id={topicNumber} className="creatorBtn colorBtn" onClick={handleNewQuestion} value="Add another question"/>
        {!isDeleteDeactivated ? 
          <input type="button" id={topicNumber} onClick={handleDeleteTopic} className="creatorBtn btnCaution" value={`Delete Topic ${topicNumber}`}/> : 
          <input type="button" id={topicNumber} onClick={handleUserMessage} className="creatorBtn btnCautionDeactivated" value={`Delete Topic ${topicNumber}`}/>
          }  
      </div>
      <p className="userMessage quizCreatorFormMessage">{messageText}</p>
    </div>
  )
}
export default QuizTopicInput;