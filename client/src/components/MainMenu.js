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
  const [summaryStats, setSummaryStats] = useState({});

  // fetch and set state of stats from backend.
  useEffect(() => {
    getQuizData();
    const requestBody = {
      userName : userName,
      password : password,
    }
    axios.post("/user/" + userId, requestBody)
      .then(res => {
        setGlobalStats(res.data.globalStats)
        setSummaryStats(res.data.summaryStats)
      })
      .catch(err => console.log(err))
  }, [])
  
  return(
    <main>
      <Header globalStats={globalStats} negateMetrics={false}/>
      <NavBar />
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