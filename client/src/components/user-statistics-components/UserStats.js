import {useState, useEffect, useContext} from "react";
import {AppContext} from "./../../context/AppContext";
import Header from "./../Header";
import NavBar from './../navbar-components/NavBar';
import UserStatsTabset from "./UserStatsTabset";
import UserStatsPane from "./UserStatsPane";

const UserStats = () => {

    const {getUserGlobalStats, navCallbacks : {navToMenu}} = useContext(AppContext);

  // create state to contain global statistics data
    const [globalStats, setGlobalStats] = useState({
      summarizedSubjects: [],
      summarizedQuizzes : [],
      summarizedTopics : []
    });
    const [tabSelection, setTabSelection] = useState("Subjects");

    const selections = ["Subjects", "Quizzes", "Topics"];
  
  // wrap http request in useEffect - single render
    useEffect(() => {
      getUserGlobalStats(setGlobalStats);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

  // handle change between tabset
    const changeTabset = e => {
      const {id} = e.target;
      setTabSelection(id);
    };

  // consolidate props
  const tabsetProps = {tabSelection, changeTabset, selections};

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
              <button className="colorBtn userStatsBtn" onClick={navToMenu}>Back</button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
export default UserStats;