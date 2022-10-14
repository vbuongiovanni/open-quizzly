import React, {useContext} from 'react';
import { AppContext } from "./../../context/AppContext";

export default function QuizCard(props) {
  const {_id, quizName, subject, topicsText} = props.cardDetails;  

  const {navCallbacks : {navToQuiz}} = useContext(AppContext);

  const handleQuizSelection = (e) => {
    navToQuiz(e.target.id);
  };

  return (
    <div className="quizCardSpacer">
      <div className="quizCard" id={_id} onClick={handleQuizSelection} onDoubleClick={handleQuizSelection}>
        <div className="quizCardContent" id={_id} onClick={handleQuizSelection} onDoubleClick={handleQuizSelection}>
          <h4 className="quizCardName" id={_id} onClick={handleQuizSelection} onDoubleClick={handleQuizSelection}>{quizName}</h4>
          <h4 className="quizCardSubject emphasizedText" id={_id} onClick={handleQuizSelection} onDoubleClick={handleQuizSelection}>{subject}</h4>
          <p id={_id} onClick={handleQuizSelection} onDoubleClick={handleQuizSelection}>{topicsText}</p>
        </div>
      </div>
    </div>
  )
}