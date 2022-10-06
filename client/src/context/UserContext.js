import {createContext, useState} from "react";

export const UserContext = createContext();

export const UserContextProvider = (props) => {
 
  const initToken = {token : localStorage.getItem("token") || ""};
  
  // set state to store user credentials
    const [credentials, setCredentials] = useState(initToken);

  return (
    <UserContext.Provider value={{credentials, setCredentials}}>
      {props.children}
    </UserContext.Provider>
  )
}