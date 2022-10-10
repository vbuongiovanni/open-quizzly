import {useState} from "react";

const LoginForm = (props) => {
  const {toggleAccCreation, loginMessage, setLoginMessage, setCredentials, userAuthReq, loginFormHandler, navToLogin} = props;
  const [loginFormInputs, setLoginFormInputs] = useState({
    username : "",
    password : ""
  });

  // handler for form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    userAuthReq("login", loginFormInputs, setCredentials, setLoginMessage);
    navToLogin();
  };
  
  // handler func for inputs
  const handleChange = (e) => {
    loginFormHandler(e.target, setLoginFormInputs, setLoginMessage);
  };
  
  return(    
    <>
      <form className="loginForm" onSubmit={handleSubmit}>
        <h3 className="loginHeader">Hello again!</h3>
        <input 
          className="textInput"
          type="text"
          name="username"
          placeholder="Username"
          maxLength="15"
          minLength="2"
          pattern="[a-z0-9A-Z!]{1,}"
          required
          onChange={handleChange}
          />
        <input 
          className="textInput"
          type="password"
          name="password"
          placeholder="Password"
          maxLength="20"
          minLength="5"
          required
          onChange={handleChange}
          />
        <div className="stackedBtnContainer">
          <button className="btn colorBtn loginBtn">Login</button>
          <button className="btn colorBtn loginBtn" onClick={toggleAccCreation}>Create New Login</button>
        </div>
        <div className="loginMsgContainer">
          <p className="userMessage">{loginMessage}</p>
        </div>
      </form>
    </>
  );
};
export default LoginForm;