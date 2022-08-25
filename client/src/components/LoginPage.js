import {useState} from "react";
import LoginForm from "./login-components/LoginForm";
import UserCreateForm from "./login-components/UserCreateForm";

export default () => {
  const [accCreation, setAccCreation] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");

  // handler to toggle Acc. Creation
  const toggleAccCreation = () => {
    setAccCreation(prevValue => !prevValue);
    console.log(accCreation);
    // this prevents form submission:
    return false;
  }
  return(
    <div className="loginMain">
      <h1>Welcome to Quizzly!</h1>
      <img className="bearLogoMain" src={require("../resources/quizzly-bear.png")}/>
      {!accCreation ? 
        <LoginForm toggleAccCreation={toggleAccCreation}/> : 
        <UserCreateForm toggleAccCreation={toggleAccCreation} setLoginMessage={setLoginMessage}/>}
      <h1 className="loginMessage">{loginMessage}</h1>  
    </div>
  );
}