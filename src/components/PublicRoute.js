import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";


const PublicRoute = ({ children }) => {
  const { adminInfo } = useContext(AuthContext);

  // If adminInfo exists (i.e., the user is logged in), redirect to home
  if (adminInfo) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, render the child components (like Login page)
  return children;
};

export default PublicRoute;
