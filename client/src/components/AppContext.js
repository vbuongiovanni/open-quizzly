import {createContext, useState, useEffect} from "react";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  
  // set state to store quizData
    const [quizLibrary, setQuizLibrary] = useState([]);
 
  // async function to retrieve quiz data and set state:
    const getQuizData = async () => {
      const res = await axios.get("/quiz/")
        .catch(err => console.log(err))
      if (res !== undefined) {
        const data = await res.data;
        // subset of quiz data, showing only _id, name, subject, and a stringified version of topics.
        setQuizLibrary(
          data.map(quiz => {
            const {_id, quizName, subject, topics} = quiz;
            const topicsText = topics.map(topic => topic.topicName).join(", ");
            return {_id, quizName, subject, topics, topicsText};
          })
        );
      }
    }

  // use effect to get quiz detail
    useEffect(() => {
      getQuizData();
    }, [])

  return (
    <AppContext.Provider value={{quizLibrary, getQuizData}}>
      {props.children}
    </AppContext.Provider>
  )
}