import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated } from "@/api/storage";
import { ROUTES } from "@/constants/routes";

const ProtectedRoute = () => {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to={ROUTES.login} replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
