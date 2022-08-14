import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

export default (props) => {
  const navigate = useNavigate();
  const [loginInputs, setLoginInputs] = useState({
    userName : "",
    password : ""
  });
  const {credentials, setCredentials} = props;
  const handleChange = (e) => {
    const {name, value} = e.target;
    setLoginInputs(prevInputs => ({...prevInputs, [name] : value}))
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("/user", loginInputs)
      .then(res => {
        console.log(res.data)
        if (res.data !== undefined) {
          setCredentials({...res.data});
          navigate("/menu/")
        }
        console.log(credentials === undefined)
      })
      .catch(err => console.log(err))
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