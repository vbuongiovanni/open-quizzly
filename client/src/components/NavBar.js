import { useContext} from "react";
import { AppContext } from "../context/AppContext";
import { UserContext } from "../context/UserContext";
import { useLocation} from "react-router-dom";

const NavBar = () => {

  // used to conditionally style buttons in navbar.
  const currentLocation = useLocation().pathname

  const {navCallbacks : {navToMenu, navToQuizCreator, navToUserStats}} = useContext(AppContext);
  const {handleLogout} = useContext(UserContext);

  return (
    <nav className="navBar">
      <div className={`navBarTab btn ${currentLocation === "/menu/" && "activeTab"}`} onClick={navToMenu}>
        <span className="navBarTabText">Take Me Home</span>
      </div>
      <div className={`navBarTab btn ${currentLocation === "/quiz/creator" &&  "activeTab"}`} onClick={navToQuizCreator}>
        <span className="navBarTabText">Create New Quiz</span>
      </div>
      <div className={`navBarTab btn ${currentLocation === "/user/stats" && "activeTab"}`} onClick={navToUserStats}>
        <span className="navBarTabText">My Global Stats</span>
      </div>
      <div className={`navBarTab btn`} onClick={handleLogout}>
        <span className="navBarTabText">Sign Out</span>
      </div>
    </nav>
  )
}
export default NavBar;