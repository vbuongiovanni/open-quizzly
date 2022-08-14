import React, {useContext} from 'react';
import QuizCard from "./QuizCard";
import {useNavigate} from 'react-router-dom';
import {AppContext} from "./AppContext";

function MainMenu(props)  {

  const navigate = useNavigate();
  const {userName} = props.credentials;
  const contextValue = useContext(AppContext);
  const {quizLibrary} = contextValue;

  const handleClick = (e) => {
    navigate("/quiz/" + e.target.id)
  }

  return(
    <>
      <main>
        <div  className="quizDataDisplay">
          <h2>Welcome, {userName}!</h2>
        </div>
        <div className="quizCardDisplay">
            {quizLibrary.map(quiz => <QuizCard 
                                            key={quiz._id}
                                            handleClick={handleClick}
                                            cardDetails={quiz}/>
                                        )}
        </div>
      </main>
    </>
  )
}

export default MainMenu