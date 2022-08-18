import {useState, useContext} from "react";
import {useNavigate} from "react-router-dom";
import { UserContext } from "./UserContext";
import axios from "axios";

export default (props) => {
  const navigate = useNavigate();
  const [loginInputs, setLoginInputs] = useState({
    userName : "",
    password : ""
  });
  const {setCredentials} = useContext(UserContext);

  // handler for form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("/user", loginInputs)
      .then(res => {
        if (res.data !== undefined) {
          setCredentials({...res.data});
          navigate("/menu/")
        }
      })
      .catch(err => console.log(err))
  };
  
  // handler func for inputs
  const handleChange = (e) => {
    const {name, value} = e.target;
    setLoginInputs(prevInputs => ({...prevInputs, [name] : value}))
  };
  
  return(    
    <div>
      <div className="loginFormDiv">
        <form className="loginForm" onSubmit={handleSubmit}>
          
          <label htmlFor="userName">Username</label>
          <input 
            type="text"
            name="userName"
            onChange={handleChange}
          />
          <label htmlFor="password">Password</label>
          <input type="text"
            name="password"
            onChange={handleChange}
          />
          <button className="loginButton">Login</button>
        </form>
      </div>
    </div>
  );
}