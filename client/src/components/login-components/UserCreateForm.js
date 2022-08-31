import {useState} from "react";
import axios from "axios";

const UserCreateForm = props => {
  const {toggleAccCreation, setLoginMessage} = props
  const [loginInputs, setLoginInputs] = useState({
    userName : "",
    password : "",
    confirmPassword : ""
  });
  const [loginCreateMessage, setLoginCreateMessage] = useState("")

  // handler for form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("/user/new", loginInputs)
      .then(res => {
        if (res.data !== undefined) {
          setLoginMessage(res.data);
          toggleAccCreation();
        } else {
          setLoginCreateMessage("Something went wrong - please try again.")
        }
      })
      .catch(err => setLoginCreateMessage(err.response.data.errMsg))
  };
  
  // handler func for inputs
  const handleChange = (e) => {
    const {name, value} = e.target;
    if (name === "userName") {
      const pattern = /\w/
      const restrictedChars = value.split("").every(element => {
        return pattern.test(element);
      })
      if (!restrictedChars) {
        setLoginCreateMessage("Please use only alphanumeric characters for username.")
      } else {
        setLoginCreateMessage("")
        setLoginInputs(prevInputs => ({...prevInputs, [name] : value}))
      }
    } else {
      const pattern = /(\w|!|@|#|\?)/
      const restrictedChars = value.split("").every(element => {
        return pattern.test(element);
      })
      if (!restrictedChars) {
        setLoginCreateMessage("Valid characters password include only alphanumeric and _, !, @, #, $, and ?")
      } else {
        setLoginCreateMessage("")
        setLoginInputs(prevInputs => ({...prevInputs, [name] : value}))
      }
    }
  };
  
  return(
    <>
      <form className="loginForm" onSubmit={handleSubmit}>
        <h3 className="loginHeader">Let's get you set up with an account...</h3>
        <input 
          type="text"
          placeholder="New User Name"
          className="textInput"
          name="userName"
          maxLength="15"
          minLength="2"
          pattern="[a-z0-9A-Z!]{1,}"
          required
          onChange={handleChange}
        />
        <input type="text"
          name="password"
          placeholder="Password"
          className="textInput"
          maxLength="20"
          minLength="5"
          required
          onChange={handleChange}
        />
        <input type="text"
          name="confirmPassword"
          placeholder="Confirm Password"
          className="textInput"
          maxLength="20"
          minLength="5"
          required
          onChange={handleChange}
        />
        <div className="buttonContainer">
          <button className="loginButton">Create New Account</button>
          <button className="toggleAccCreateButton" onClick={toggleAccCreation}>Cancel</button>
        </div>
        <div className="loginMsgContainer">
          <p className="userMessage">{loginCreateMessage}</p>
        </div>
      </form>
    </>
  );
}
export default UserCreateForm;