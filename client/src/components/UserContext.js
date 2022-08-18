import {createContext, useState, useEffect} from "react";
export const UserContext = createContext();

export const UserContextProvider = (props) => {
  
  // set state to store user credentials
  const [credentials, setCredentials] = useState(undefined);

  return (
    <UserContext.Provider
      value={{credentials, setCredentials}}
      >
      {props.children}
    </UserContext.Provider>
  )
}