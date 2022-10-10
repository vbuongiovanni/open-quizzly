import {useState} from "react";
import { timedUserMsg } from "../../modules/timedUserMsg";
import QuizQuestionInput from "./QuizQuestionInput";

const QuizTopicInput = (props) => {
  const {topicData, numTopics, handleDeleteTopic, handleTopicChange, handleNewQuestion, handleDeleteQuestion, handleQuestionChange} = props;
  const {topicNumber, topicName, questions} = topicData;

  const [messageText, setMessageText] = useState("");

  const handleUserMessage = (e) => {
    timedUserMsg("There must be at least 1 topic.", setMessageText);
  };

  return (
    <div className="topicEditorContainer">
      <p className="topicNameText">
        {`Topic ${topicNumber}`} - <input type="text" id={topicNumber} maxLength="15" className="editorInput" placeholder="Addition" onChange={handleTopicChange} value={topicName} name="topicName" required/>
      </p>
      <div className="questionEditorContainer">
        {questions.map((question, index) => <QuizQuestionInput key={index} numQuestions={questions.length} topicNumber={topicNumber} questionData={question} handleDeleteQuestion={handleDeleteQuestion} handleQuestionChange={handleQuestionChange}/>)}
      </div>
      <div className="btnContainer btnContainerDual noBorder">
        <input type="button" id={topicNumber} className="editorBtn btn colorBtn" onClick={handleNewQuestion} value="Add New Question"/>
        {!(numTopics <= 1) ? 
          <input type="button" id={topicNumber} onClick={handleDeleteTopic} className="editorBtn btn cautionBtn" value={`Delete Topic ${topicNumber}`}/> : 
          <input type="button" id={topicNumber} onClick={handleUserMessage} className="editorBtn btn deactivatedBtn" value={`Delete Topic ${topicNumber}`}/>
          }  
      </div>
      <p className="userMessage emphasizedText quizEditorFormMessage">{messageText}</p>
    </div>
  );
};
export default QuizTopicInput;