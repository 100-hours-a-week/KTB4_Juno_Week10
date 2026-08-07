import { Outlet, useLocation } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import BottomNavigation from "@/components/layout/BottomNavigation";
import Header from "@/components/layout/Header";

const BoardLayout = () => {
  const location = useLocation();
  const isProfileRoute = location.pathname.startsWith(ROUTES.profileEdit);
  const isPostCreateRoute = location.pathname === ROUTES.postCreate;

  return (
    <div
      className={`relative mx-auto min-h-screen w-full max-w-[430px] bg-[#fff4f4] font-['Work_Sans'] text-[#191c1d] ${
        isPostCreateRoute ? "pb-20" : "pb-28"
      }`}
    >
      <Header variant={isProfileRoute ? "profile" : "board"} />
      <Outlet />
      <BottomNavigation />
    </div>
  );
};

export default BoardLayout;
