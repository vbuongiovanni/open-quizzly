import { useNavigate, useLocation} from "react-router-dom"
const NavBar = () => {

  const navigate = useNavigate();

  // used to conditionally style buttons in navbar.
  const currentLocation = useLocation().pathname

  // handler functions
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
    <nav className="navBar">
      <div className={`navBarBtn ${currentLocation === "/menu/" && "activeBtn"}`} onClick={handleNavHome}>
        <span className="navBarBtnText">Take Me Home</span>
      </div>
      <div className={`navBarBtn ${currentLocation === "/quiz/creator" &&  "activeBtn"}`} onClick={handleNavToCreator}>
        <span className="navBarBtnText">Create New Quiz</span>
      </div>
      <div className={`navBarBtn ${currentLocation === "/user/stats" && "activeBtn"}`} onClick={handleNavToUserStats}>
        <span className="navBarBtnText">My Global Stats</span>
      </div>
      <div className={`navBarBtn ${currentLocation === "/" &&  "activeBtn"}`} onClick={handleSignOut}>
        <span className="navBarBtnText">Sign Out</span>
      </div>
    </nav>
  )
}
export default NavBar;