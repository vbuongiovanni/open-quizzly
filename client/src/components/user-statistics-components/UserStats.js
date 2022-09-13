import {useState, useEffect, useContext} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {UserContext} from "../UserContext";
import Header from "../Header";
import NavBar from '../NavBar';
import UserStatsTabset from "./UserStatsTabset";
import UserStatsPane from "./UserStatsPane";

const UserStats = () => {

  // create nav object
  const navigate = useNavigate();

  // load and deconstruct context:
    const {credentials} = useContext(UserContext);
    const {userName, password, _id} = credentials

  // create state to contain global statistics data
    const [globalStats, setGlobalStats] = useState({
      summarizedSubjects: [],
      summarizedQuizzes : [],
      summarizedTopics : []
    })
    const [tabSelection, setTabSelection] = useState("Subjects")

    const selections = ["Subjects", "Quizzes", "Topics"]
  
  // wrap http request in useEffect - single render
    useEffect(() => {
      const requestBody = {
        userName : userName,
        password : password,
      }
      axios.post("/user/global/" + _id, requestBody)
        .then(res => {
          setGlobalStats(res.data)
        })
        .catch(err => console.log(err))
    }, [userName, password, _id])

  // handle nav to main menu
    const navToMain = () => {
      navigate("/menu/");
    }

  // handle change between tabset
    const changeTabset = e => {
      const {id} = e.target;
      setTabSelection(id);
    }

  // consolidate props
  const tabsetProps = {tabSelection, changeTabset, selections}

  return (
    <>
      <Header negateMetrics={true}/>
      <NavBar />
      <main>
        <div className="userStatsContainer">
          <div className="userStatsContent">
              <UserStatsTabset tabsetProps={tabsetProps}/>
              <UserStatsPane globalStats={globalStats} tabSelection={tabSelection}/>
            <div className="btnContainer btnContainerSingle">
              <button className="colorBtn userStatsBtn" onClick={navToMain}>Back</button>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
export default UserStats