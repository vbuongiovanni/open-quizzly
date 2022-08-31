import {useState} from "react";
import LoginForm from "./LoginForm";
import UserCreateForm from "./UserCreateForm";

const Login = () => {
  const [accCreation, setAccCreation] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");

  // handler to toggle between sign-in and Acc. Creation component
  const toggleAccCreation = () => {
    setAccCreation(prevValue => !prevValue);
    return false;
  }

  return(
    <div className="loginMain">
      <h1>Welcome to Quizzly!</h1>
      <img className="bearLogoMain" src={require("../../resources/quizzly-bear.png")} alt={"Presentational icon of a cartoon bear wearing a graduation cap"}/>
      {!accCreation ? 
        <LoginForm toggleAccCreation={toggleAccCreation}/> : 
        <UserCreateForm toggleAccCreation={toggleAccCreation} setLoginMessage={setLoginMessage}/>}
      <h1 className="loginMessage">{loginMessage}</h1>  
    </div>
  );
}
export default Login;