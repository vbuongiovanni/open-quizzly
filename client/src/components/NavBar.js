import { useNavigate, useLocation} from "react-router-dom"
const NavBar = () => {

  const navigate = useNavigate();

  // NOTE TO FUTURE SELF - I AM GOING TO USE THIS W/ CSS TO SHOW WHICH DIVBUTTON IS CURRENTLY SELECTED.
  const currentLocation = useLocation().pathname

  const handleNavHome  = () => {
    navigate("/menu/");
  }
  const handleNavToCreator  = () => {
    navigate("/quiz/creator");
  }  
  const handleNavToUserStats  = () => {
    navigate("/user/stats");
  }
  const handleSignOut = () => {
    localStorage.removeItem("credentials");
    navigate("/");
  }

  return (
    <nav className="NavBar">
      <div className="NavBarBtn" onClick={handleNavHome}>
        <span className="NavBarBtnText">Take Me Home</span>
      </div>
      <div className="NavBarBtn" onClick={handleNavToCreator}>
        <span className="NavBarBtnText">Create New Quiz</span>
      </div>
      <div className="NavBarBtn" onClick={handleNavToUserStats}>
        <span className="NavBarBtnText">My Global Stats</span>
      </div>
      <div className="NavBarBtn" onClick={handleSignOut}>
        <span className="NavBarBtnText">Sign Out</span>
      </div>
    </nav>
  )
}
export default NavBar;