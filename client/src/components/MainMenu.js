import React, {useContext, useEffect, useState} from 'react';
import {AppContext} from "../context/AppContext";
import {UserContext} from "../context/UserContext";
import { parseToken } from '../modules/parseToken';
import Header from "./Header"
import NavBar from './navbar-components/NavBar';
import QuizCard from "./quiz-components/QuizCard";

const MainMenu = () => {

  // load and deconstruct context:
  const {credentials} = useContext(UserContext);
    const {username} = parseToken(credentials.token);
  const {getQuizData, getUserSummaryStats} = useContext(AppContext);

  const [globalStats, setGlobalStats] = useState({});
  const [quizLibrary, setQuizLibrary] = useState([]);

  // fetch and set state of stats from backend.
  useEffect(() => {
    getQuizData(setQuizLibrary);
    getUserSummaryStats(setGlobalStats);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
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