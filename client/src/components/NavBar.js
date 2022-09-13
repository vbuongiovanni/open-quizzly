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
      <div className={`navBarTab btn ${currentLocation === "/menu/" && "activeTab"}`} onClick={handleNavHome}>
        <span className="navBarTabText">Take Me Home</span>
      </div>
      <div className={`navBarTab btn ${currentLocation === "/quiz/creator" &&  "activeTab"}`} onClick={handleNavToCreator}>
        <span className="navBarTabText">Create New Quiz</span>
      </div>
      <div className={`navBarTab btn ${currentLocation === "/user/stats" && "activeTab"}`} onClick={handleNavToUserStats}>
        <span className="navBarTabText">My Global Stats</span>
      </div>
      <div className={`navBarTab btn ${currentLocation === "/" &&  "activeTab"}`} onClick={handleSignOut}>
        <span className="navBarTabText">Sign Out</span>
      </div>
    </nav>
  )
}
export default NavBar;