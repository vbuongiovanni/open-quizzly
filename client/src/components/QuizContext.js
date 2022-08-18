import {createContext, useState, useEffect, useContext} from "react";
import {AppContext} from "./AppContext";
import { useNavigate } from "react-router-dom";
export const QuizContext = createContext();

export const QuizContextProvider = (props) => {
  
  // create state for active quiz data
  const [activeQuiz, setActiveQuiz] = useState();

  // create navigate object:
  const navigate = useNavigate();
  
  // handle quiz selection:
  const handleQuizSelection = (e) => {
    navigate(`/quiz/${e.target.id}`);
  }

  return (
    <QuizContext.Provider
      value={{handleQuizSelection, setActiveQuiz, activeQuiz}}
      >
      {props.children}
    </QuizContext.Provider>
  )
}