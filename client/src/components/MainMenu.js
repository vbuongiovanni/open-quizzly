import React, {useContext} from 'react';
import {AppContext} from "./AppContext";
import {UserContext} from "./UserContext";
import Header from "./Header"
import QuizCard from "./quiz-components/QuizCard";

const MainMenu = () => {

  // load and deconstruct context:
  const {credentials} = useContext(UserContext);
  const {quizLibrary} = useContext(AppContext);

  const {userName, summaryStats, globalStats} = credentials;
  
  return(
    <main>
      <Header globalStats={globalStats} negateMetrics={false}/>
        <div  className="welcomeTextContainer">
          <h1>Welcome, {userName}!</h1>
        </div>
        <div className="quizCardDisplay">
            {quizLibrary.map(quiz => <QuizCard key={quiz._id} cardDetails={quiz}/>)}
        </div>
    </main>
  )
}
export default MainMenu;