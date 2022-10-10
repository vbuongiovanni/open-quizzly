import { useLocation} from "react-router-dom";

const NavBarBtn = props => {
  const {btnText, isActiveLocation, onClick} = props;

  // used to conditionally style buttons in navbar.
  const currentLocation = useLocation().pathname;

  return (
    <div className={`navBarTab btn ${currentLocation === isActiveLocation && "activeTab"}`} onClick={onClick}>
      <span className="navBarTabText">{btnText}</span>
    </div>
  );
};
export default NavBarBtn;