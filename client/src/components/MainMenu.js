import React, {useContext, useEffect, useState} from 'react';
import {AppContext} from "./AppContext";
import {UserContext} from "./UserContext";
import axios from "axios";
import Header from "./Header"
import NavBar from './NavBar';
import QuizCard from "./quiz-components/QuizCard";

const MainMenu = () => {

  // load and deconstruct context:
  const {credentials} = useContext(UserContext);
  const {quizLibrary, getQuizData} = useContext(AppContext);

  const {userName, password, _id : userId} = credentials;

  const [globalStats, setGlobalStats] = useState({});

  // fetch and set state of stats from backend.
 
  useEffect(() => {
    getQuizData();
    const requestBody = {
      userName : userName,
      password : password,
    }
    axios.post("/user/summary/" + userId, requestBody)
      .then(res => {
        setGlobalStats(res.data.globalStats)
      })
      .catch(err => console.log(err))
  }, [userName, password, userId, ])
  
  return(
    <>
      <Header globalStats={globalStats} negateMetrics={false}/>
      <NavBar />
      <main>
        <div  className="welcomeTextContainer">
          <h1>Welcome, {userName}!</h1>
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