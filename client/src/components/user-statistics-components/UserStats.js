import {useState, useEffect, useContext} from "react";
import axios from "axios";
import {UserContext} from "../UserContext";
import Header from "../Header";
import NavBar from '../NavBar';
const UserStats = () => {

  // load and deconstruct context:
  const {credentials} = useContext(UserContext);
  
  useEffect(() => {
    const requestBody = {
      userName : credentials.userName,
      password : credentials.password,
    }
    axios.post("/user/global/" + credentials._id, requestBody)
      .then(res => {
        console.log(res.data)
      })
      .catch(err => console.log(err))

  }, [])

  return (
    <main>
      <Header negateMetrics={true}/>
      <NavBar />
      UserStats!
    </main>
  )
}
export default UserStats