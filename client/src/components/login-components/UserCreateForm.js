import {useState} from "react";

const UserCreateForm = props => {
  const {toggleAccCreation, loginMessage, setLoginMessage, setCredentials, userAuthReq, loginFormHandler, navToLogin} = props;

  const [loginFormInputs, setLoginFormInputs] = useState({
    username : "",
    password : "",
    confirmPassword : ""
  });

  // handler for form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (loginFormInputs.password !== loginFormInputs.confirmPassword) {
      setLoginMessage("Your password and the confirmation must match.");
    } else {
      userAuthReq("signup", loginFormInputs, setCredentials, setLoginMessage);
      navToLogin();
      toggleAccCreation();
    }
  };
  
  // handler func for inputs
  const handleChange = (e) => {
    loginFormHandler(e.target, setLoginFormInputs, setLoginMessage);
  };
  
  return(
    <>
      <form className="loginForm" onSubmit={handleSubmit}>
        <h3 className="loginHeader">Let's get you set up with an account...</h3>
        <input 
          type="text"
          placeholder="New User Name"
          className="textInput"
          name="username"
          maxLength="15"
          minLength="2"
          pattern="[a-z0-9A-Z!]{1,}"
          required
          onChange={handleChange}
        />
        <input 
          type="password"
          name="password"
          placeholder="Password"
          className="textInput"
          maxLength="20"
          minLength="5"
          required
          onChange={handleChange}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          className="textInput"
          maxLength="20"
          minLength="5"
          required
          onChange={handleChange}
        />
        <div className="stackedBtnContainer">
          <button className="loginBtn btn colorBtn">Create New Account</button>
          <button className="loginBtn btn colorBtn" onClick={toggleAccCreation}>Cancel</button>
        </div>
        <div className="loginMsgContainer">
          <p className="userMessage">{loginMessage}</p>
        </div>
      </form>
    </>
  );
};
export default UserCreateForm;