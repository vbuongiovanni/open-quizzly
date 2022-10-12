import React, {useContext, useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom';
import {AppContext} from "../context/AppContext";
import {UserContext} from "../context/UserContext";
import { parseToken } from '../modules/parseToken';
import Header from "./Header";
import NavBar from './navbar-components/NavBar';
import QuizCard from "./quiz-components/QuizCard";
import RevealingFilter from './common-components/RevealingFilter';

const MainMenu = () => {

  // load and deconstruct context:
  const {credentials} = useContext(UserContext);
    const {username} = parseToken(credentials.token);
  const {getQuizData, getUserSummaryStats} = useContext(AppContext);

  const [globalStats, setGlobalStats] = useState({});
  const [quizLibrary, setQuizLibrary] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [subjectSelections, setSubjectSelections] = useState([]);
  const [filterHeight, setFilterHeight] = useState(0);

  // fetch and set state of stats from backend.
  useEffect(() => {
    getQuizData(setQuizLibrary, setSubjects, undefined);
    getUserSummaryStats(setGlobalStats);
    setSubjectSelections(subjects)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useLocation().pathname])
  
  return(
    <>
      <Header globalStats={globalStats} negateMetrics={false}/>
      <NavBar />
      <main>
        <div  className="welcomeTextContainer">
          <h1>Welcome, {username}!</h1>
        </div>
        <div className="quizCardDisplayContainer">
          <div className="quizCardDisplaySpacer spacerTextContainer"><span className="spacerText">Filter by one or more subjects, then select a quiz card to begin</span></div>
          <RevealingFilter 
            subjects={subjects}
            filterHeight={filterHeight}
            subjectSelections={subjectSelections}
            setSubjectSelections={setSubjectSelections}
            setFilterHeight={setFilterHeight}
          />
          <div className="quizCardDisplay">
              {quizLibrary.filter(quiz => subjectSelections.includes(quiz.subject) || subjectSelections.length === 0).map(quiz => <QuizCard key={quiz._id} cardDetails={quiz}/>)}
          </div>
          <div className="quizCardDisplaySpacer"></div>
        </div>
      </main>
    </>
  )
}
export default MainMenu;