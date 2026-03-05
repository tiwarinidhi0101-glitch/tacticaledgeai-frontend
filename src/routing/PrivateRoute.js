import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 

const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();
  console.log("is auth",isAuthenticated)
  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default PrivateRoute;
