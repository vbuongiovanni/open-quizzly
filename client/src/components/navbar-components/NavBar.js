import { useContext} from "react";
import { AppContext } from "./../../context/AppContext";
import { UserContext } from "./../../context/UserContext";
import NavBarBtn from "./NavBarBtn";

const NavBar = () => {

  const {navCallbacks : {navToMenu, navToQuizEditorList, navToQuizCreator, navToUserStats}} = useContext(AppContext);
  const {handleLogout} = useContext(UserContext);
    
  return (
    <nav className="navBar">
      <NavBarBtn btnText={"Take A Quiz"} isActiveLocation={"/menu"} onClick={navToMenu}/>
      <NavBarBtn btnText={"Quiz Editor"} isActiveLocation={"/quiz/editor"} onClick={navToQuizEditorList}/>
      <NavBarBtn btnText={"Create New Quiz"} isActiveLocation={"/quiz/creator"} onClick={navToQuizCreator}/>
      <NavBarBtn btnText={"My Global Stats"} isActiveLocation={"/user/stats"} onClick={navToUserStats}/>
      <NavBarBtn btnText={"Logout"} isActiveLocation={"/"} onClick={handleLogout}/>
    </nav>
  );
};
export default NavBar;