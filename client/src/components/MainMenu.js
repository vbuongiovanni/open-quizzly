import React, {useContext} from 'react';
import QuizCard from "./QuizCard";
import {AppContext} from "./AppContext";
import {UserContext} from "./UserContext";

export default () => {

  // load and deconstruct context:
  const userContext = useContext(UserContext);
  const {userName} = userContext.credentials;

  const appContext = useContext(AppContext);
  const {quizLibrary} = appContext;

  return(
    <>
      <main>
        <div  className="quizDataDisplay">
          <h2>Welcome, {userName}!</h2>
        </div>
        <div className="quizCardDisplay">
            {quizLibrary.map(quiz => <QuizCard 
                                            key={quiz._id}
                                            cardDetails={quiz}/>
                                        )}
        </div>
      </main>
    </>
  )
}