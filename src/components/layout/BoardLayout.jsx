import { Outlet, useLocation } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import BottomNavigation from "./BottomNavigation";
import Header from "./Header";

const BoardLayout = () => {
  const location = useLocation();
  const isProfileRoute = location.pathname.startsWith(ROUTES.profileEdit);

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[430px] bg-[#f8f9fa] pb-28 font-['Work_Sans'] text-[#191c1d]">
      <Header variant={isProfileRoute ? "profile" : "board"} />
      <Outlet />
      <BottomNavigation />
    </div>
  );
};

export default BoardLayout;
