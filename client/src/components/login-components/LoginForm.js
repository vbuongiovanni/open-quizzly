import {useState, useContext} from "react";
import {useNavigate} from "react-router-dom";
import { UserContext } from "../UserContext";
import axios from "axios";

export default (props) => {
  const {toggleAccCreation} = props
  const navigate = useNavigate();
  const [loginFormInputs, setLoginFormInputs] = useState({
    userName : "",
    password : ""
  });
  const {setCredentials} = useContext(UserContext);
  const [loginMessage, setLoginMessage] = useState("")

  // handler for form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("/user", loginFormInputs)
      .then(res => {
        if (res.data !== undefined) {
          setCredentials({...res.data});
          navigate("/menu/")
        }
      })
      .catch(err => setLoginMessage(err.response.data.errMsg))
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
        setLoginMessage("Please use only alphanumeric characters for username.")
      } else {
        setLoginMessage("")
        setLoginFormInputs(prevInputs => ({...prevInputs, [name] : value}))
      }
    } else {
      const pattern = /(\w|\!|\@|\#|\?)/
      const restrictedChars = value.split("").every(element => {
        return pattern.test(element);
      })
      if (!restrictedChars) {
        setLoginMessage("Valid characters password include only alphanumeric and _, !, @, #, $, and ?")
      } else {
        setLoginMessage("")
        setLoginFormInputs(prevInputs => ({...prevInputs, [name] : value}))
      }
    }
  };
  
  return(    
    <form className="loginForm" onSubmit={handleSubmit}>
      <label htmlFor="userName">Username</label>
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
      <p className="loginMessage">{loginMessage}</p>
      <button className="loginButton">Login</button>
      <input type="button" className="loginButton" onClick={toggleAccCreation} value="Create New Login"/>
    </form>
  );
}