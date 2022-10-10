import {useState, useContext} from "react";
import LoginForm from "./LoginForm";
import UserCreateForm from "./UserCreateForm";
import { UserContext } from "../../context/UserContext";
import { AppContext } from "../../context/AppContext";

const Login = () => {
  const [accCreation, setAccCreation] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");

  const {setCredentials} = useContext(UserContext);
  const {userAuthReq, loginFormHandler, navCallbacks : {navToLogin}} = useContext(AppContext);

  // handler to toggle between sign-in and Acc. Creation component
    const toggleAccCreation = () => {
      setAccCreation(prevValue => !prevValue);
      return false;
    };
  // err

  return(
    <div className="loginMain">
      <h1>Welcome to Quizzly!</h1>
      <img className="bearLogoMain" src={require("../../resources/quizzly-bear.png")} alt={"Presentational icon of a cartoon bear wearing a graduation cap"}/>
      {!accCreation ? 
        <LoginForm toggleAccCreation={toggleAccCreation} loginFormHandler={loginFormHandler} setLoginMessage={setLoginMessage} loginMessage={loginMessage} setCredentials={setCredentials} userAuthReq={userAuthReq} navToLogin={navToLogin}/> : 
        <UserCreateForm toggleAccCreation={toggleAccCreation} loginFormHandler={loginFormHandler} setLoginMessage={setLoginMessage} loginMessage={loginMessage} setCredentials={setCredentials} userAuthReq={userAuthReq} navToLogin={navToLogin}/>}
    </div>
  );
};
export default Login;