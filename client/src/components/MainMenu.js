import React, {useEffect, useState, useContext} from 'react';
import axios from "axios";
import QuizCard from "./QuizCard";
import {AppContext} from "./AppContext";
import App from '../App';


function MainMenu(props)  {

  const userName = "John Smith";
  const contextValue = useContext(AppContext);
  const {quizLibrary} = contextValue;

  return(
    <main>
      <div  className="quizDataDisplay">
        <h2>Welcome, {userName}!</h2>
      </div>
      <div className="quizCardDisplay">
          {quizLibrary.map(quiz => <QuizCard 
                                          key={quiz._id}
                                          handleClick={props.handleClick}
                                          cardDetails={quiz}/>
                                      )}
      </div>
    </main>
  )
}

export default MainMenu