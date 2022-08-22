import React, {useContext} from 'react';
import {AppContext} from "./AppContext";
import {UserContext} from "./UserContext";
import Navbar from "./Navbar"
import QuizCard from "./quiz-components/QuizCard";

export default () => {

  // load and deconstruct context:
  const {credentials} = useContext(UserContext);
  const {userName, summaryStats, globalStats} = credentials;

  const appContext = useContext(AppContext);
  const {quizLibrary} = appContext;

  return(
    <>
      <Navbar globalStats={globalStats}/>
      <main>
        <div  className="quizDataDisplay">
          <h2>Welcome, {userName}!</h2>
        </div>
        <div className="quizCardDisplay">
            {quizLibrary.map(quiz => <QuizCard key={quiz._id} cardDetails={quiz}/>)}
        </div>
      </main>
    </>
  )
}