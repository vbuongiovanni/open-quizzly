import {useState, useContext} from "react";
import {useNavigate} from "react-router-dom";
import { UserContext } from "./UserContext";
import LoginForm from "./login-components/LoginForm";
import UserCreateForm from "./login-components/UserCreateForm";
import axios from "axios";

export default (props) => {
  const [accCreation, setAccCreation] = useState(false)
  const [loginMessage, setLoginMessage] = useState("")

  // handler to toggle Acc. Creation
  const toggleAccCreation = () => {
    setAccCreation(prevValue => !prevValue)
    console.log(accCreation)
    // this negates form submittion:
    return false;
  }
  console.log(loginMessage)
  return(    
    <div>
      <div className="loginFormDiv">
        {!accCreation ? 
          <LoginForm toggleAccCreation={toggleAccCreation}/> : 
          <UserCreateForm toggleAccCreation={toggleAccCreation} setLoginMessage={setLoginMessage}/>}
        <h1 className="loginMessage">{loginMessage}</h1>  
      </div>
    </div>
  );
}