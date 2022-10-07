import React, {useContext, useEffect, useState} from 'react';
import {AppContext} from "../context/AppContext";
import {UserContext} from "../context/UserContext";
import Header from "./Header"
import NavBar from './NavBar';
import QuizCard from "./quiz-components/QuizCard";

const MainMenu = () => {

  // load and deconstruct context:
  const {credentials} = useContext(UserContext);
  const {getQuizData, getUserSummaryStats, parseToken} = useContext(AppContext);
  const {username, userId} = parseToken(credentials.token);

  const [globalStats, setGlobalStats] = useState({});
  const [quizLibrary, setQuizLibrary] = useState([]);

  // fetch and set state of stats from backend.
  useEffect(() => {
    getQuizData(setQuizLibrary);
    getUserSummaryStats(setGlobalStats)
  }, [username, userId])
  
  return(
    <>
      <Header globalStats={globalStats} negateMetrics={false}/>
      <NavBar />
      <main>
        <div  className="welcomeTextContainer">
          <h1>Welcome, {username}!</h1>
        </div>
        <div className="quizCardDisplayContainer">
          <div className="quizCardDisplaySpacer spacerTextContainer"><span className="spacerText">Select a quiz card to begin</span></div>
          <div className="quizCardDisplay">
              {quizLibrary.map(quiz => <QuizCard key={quiz._id} cardDetails={quiz}/>)}
          </div>
          <div className="quizCardDisplaySpacer"></div>
        </div>
      </main>
    </>
  )
}
export default MainMenu;