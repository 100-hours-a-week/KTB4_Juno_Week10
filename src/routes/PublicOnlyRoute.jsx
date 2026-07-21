import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../api/storage";
import { ROUTES } from "../constants/routes";

const PublicOnlyRoute = () => {
  if (isAuthenticated()) {
    return <Navigate to={ROUTES.posts} replace />;
  }

  return <Outlet />;
};

export default PublicOnlyRoute;
