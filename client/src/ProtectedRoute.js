import {Navigate} from "react-router-dom";
const ProtectedRoute = props => {
  const {redirectRoute, children, token} = props;
  return token ? children : <Navigate to={redirectRoute}/>
}
export default ProtectedRoute;