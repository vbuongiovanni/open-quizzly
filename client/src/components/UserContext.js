import {createContext, useContext, useEffect, useState} from "react";
import { AppContext } from "./AppContext";

export const UserContext = createContext();

export const UserContextProvider = (props) => {
  
  // set state to store user credentials
    const [credentials, setCredentials] = useState(undefined);
    const localCredentials = JSON.parse(localStorage.getItem("credentials"));
  
  // if credentials is undefined, set to credentials saved in localStorage
    if (credentials === undefined) {
      setCredentials(localCredentials)
    }

  // get context from AppContext to get function that sets quiz data
    const {getQuizData} = useContext(AppContext)
  
  // manually run getQuizData - this allows the app to run after a user envoked refresh
    useEffect(() => {
      getQuizData()
    }, [credentials])

  return (
    <UserContext.Provider value={{credentials, setCredentials}}>
      {props.children}
    </UserContext.Provider>
  )
}