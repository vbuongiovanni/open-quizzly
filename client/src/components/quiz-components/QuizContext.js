import {createContext, useState} from "react";
export const QuizContext = createContext();

export const QuizContextProvider = (props) => {
  
  // create state for active quiz data
  const [activeQuiz, setActiveQuiz] = useState();

  return (
    <QuizContext.Provider value={{setActiveQuiz, activeQuiz}}>
      {props.children}
    </QuizContext.Provider>
  )
}