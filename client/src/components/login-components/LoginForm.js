import {useState, useContext} from "react";
import {useNavigate} from "react-router-dom";
import { UserContext } from "../UserContext";
import axios from "axios";

const LoginForm = (props) => {
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
          navigate("/menu/");
          localStorage.setItem("credentials", JSON.stringify(res.data))
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
      const pattern = /(\w|!|@|#|\?)/
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
    <>
      <form className="loginForm" onSubmit={handleSubmit}>
        <h3 className="loginHeader">Hello again!</h3>
        <input 
          className="textInput"
          type="text"
          name="userName"
          placeholder="Username"
          maxLength="15"
          minLength="2"
          pattern="[a-z0-9A-Z!]{1,}"
          required
          onChange={handleChange}
          />
        {/* <label htmlFor="password">Password</label> */}
        <input 
          className="textInput"
          type="text"
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
}
export default LoginForm;