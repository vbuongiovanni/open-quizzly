import {useState} from "react";
import axios from "axios";

export default (props) => {
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
          console.log(res.data);
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
      const pattern = /(\w|\!|\@|\#|\?)/
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
    <form className="loginForm" onSubmit={handleSubmit}>
      <label htmlFor="userName">New User Name</label>
      <input 
        type="text"
        name="userName"
        maxLength="15"
        minLength="2"
        pattern="[a-z0-9A-Z!]{1,}"
        required
        onChange={handleChange}
      />
      <label htmlFor="password">Password</label>
      <input type="text"
        name="password"
        maxLength="20"
        minLength="5"
        required
        onChange={handleChange}
      />
      <label htmlFor="password">Confirm Password</label>
      <input type="text"
        name="confirmPassword"
        maxLength="20"
        minLength="5"
        required
        onChange={handleChange}
      />
      <p className="loginCreateMessage">{loginCreateMessage}</p>
      <button className="loginButton">Create New Account</button>
      <input type="button" className="loginButton" onClick={toggleAccCreation} value="Cancel"/>
    </form>
  );
}