import {createContext, useState, useContext} from "react";
import { AppContext } from "./AppContext";

export const UserContext = createContext();

export const UserContextProvider = (props) => {

  const {navCallbacks : {navToLogin} } = useContext(AppContext);
 
  const initToken = {token : localStorage.getItem("token") || ""};
  
  // set state to store user credentials
    const [credentials, setCredentials] = useState(initToken);

  // handle logout 

  const handleLogout = () => {
    localStorage.removeItem("token");
    setCredentials({token : ""});
    navToLogin();
  }

  return (
    <UserContext.Provider value={{credentials, setCredentials, handleLogout}}>
      {props.children}
    </UserContext.Provider>
  )
}