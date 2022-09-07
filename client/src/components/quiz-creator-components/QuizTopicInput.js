import {useState} from "react";
import QuizQuestionInput from "./QuizQuestionInput";

const QuizTopicInput = (props) => {
  const {topicData, createNewTopic, handleDeleteTopic, handleTopicChange, handleNewQuestion, handleDeleteQuestion, handleQuestionChange} = props;
  const {topicNumber, topicName, questions} = topicData;

  return (
    <div className="topicCreatorContainer">

      <p className="topicNameText">
        {`Topic ${topicNumber}`} - <input type="text" id={topicNumber} className="creatorInput" placeholder="Addition" onChange={handleTopicChange} value={topicName} name="topicName" required/>
      </p>
      
      <div className="questionCreatorContainer">
        {questions.map((question, index) => <QuizQuestionInput key={index} topicNumber={topicNumber} questionData={question} handleDeleteQuestion={handleDeleteQuestion} handleQuestionChange={handleQuestionChange}/>)}
      </div>

      <div className="btnContainer btnContainerDual noBorder">
        <input type="button" id={topicNumber} className="creatorBtn colorBtn" onClick={handleNewQuestion} value="Add another question"/>
        <input type="button" id={topicNumber} onClick={handleDeleteTopic} className="creatorBtn btnCaution" value={`Delete Topic ${topicNumber}`}/>
      </div>

    </div>
  )
}
export default QuizTopicInput;