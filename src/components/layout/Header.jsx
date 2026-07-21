import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import Icon from "../common/Icon";
import ProfileMenu from "./ProfileMenu";

const Header = ({ variant = "board" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isProfile = variant === "profile";

  const handleBack = () => {
    if (isProfile) {
      navigate(ROUTES.posts);
      return;
    }

    if (location.pathname === ROUTES.posts) {
      navigate(-1);
      return;
    }

    navigate(ROUTES.posts);
  };

  return (
    <header className="fixed left-1/2 top-0 z-[200] flex h-16 w-full max-w-[430px] -translate-x-1/2 items-center justify-between bg-[#f8f9fa]/95 px-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] backdrop-blur-xl">
      <div className="flex items-center">
        {isProfile ? (
          <Link
            to={ROUTES.posts}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#9c2600] transition hover:bg-[#f3f4f5] active:scale-95"
            aria-label="게시글 목록으로 이동"
          >
            <Icon
              className="text-[24px]"
              style={{ color: "#9c2600", fontVariationSettings: '"wght" 700' }}
            >
              arrow_back
            </Icon>
          </Link>
        ) : (
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#9c2600] transition hover:bg-[#f3f4f5] active:scale-95"
            aria-label="이전 페이지로 이동"
            onClick={handleBack}
          >
            <Icon
              className="text-[24px]"
              style={{ color: "#9c2600", fontVariationSettings: '"wght" 700' }}
            >
              arrow_back
            </Icon>
          </button>
        )}
      </div>

      <h1 className="pointer-events-none absolute left-1/2 max-w-[calc(100%-144px)] -translate-x-1/2 truncate text-center font-['Plus_Jakarta_Sans'] text-xl font-bold leading-7 text-[#b71422]">
        Community
      </h1>

      <ProfileMenu variant={variant} />
    </header>
  );
};

export default Header;
