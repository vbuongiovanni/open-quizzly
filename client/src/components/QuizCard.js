import {useContext} from "react";
import {QuizContext} from './QuizContext';
import React from 'react';

export default function QuizCard(props) {
  const {_id, quizName, subject, topicsText} = props.cardDetails;
  
  // load and deconstruct context:
  const quizContext = useContext(QuizContext);
  const {handleQuizSelection} = quizContext;

  return (
    <div className="quizCard" id={_id} onClick={handleQuizSelection} onDoubleClick={handleQuizSelection}>
      <div className="quizCardContent" id={_id} onClick={handleQuizSelection} onDoubleClick={handleQuizSelection}>
        <h4 className="quizCardName" id={_id} onClick={handleQuizSelection} onDoubleClick={handleQuizSelection}>{quizName}</h4>
        <h4 className="quizCardSubject" id={_id} onClick={handleQuizSelection} onDoubleClick={handleQuizSelection}>{subject}</h4>
        <p id={_id} onClick={handleQuizSelection} onDoubleClick={handleQuizSelection}>{topicsText}</p>
      </div>
    </div>
  )
}