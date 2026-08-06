import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import Icon from "@/components/common/Icon";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isCategoryDetailRoute = location.pathname.startsWith(
    `${ROUTES.categories}/`,
  );
  const hideBackButton = [
    ROUTES.posts,
    ROUTES.categories,
    ROUTES.bookmarks,
    ROUTES.profileEdit,
  ].includes(location.pathname);

  const handleBack = () => {
    if (location.pathname === ROUTES.posts) {
      navigate(-1);
      return;
    }

    if (isCategoryDetailRoute) {
      navigate(ROUTES.categories);
      return;
    }

    navigate(ROUTES.posts);
  };

  return (
    <header className="absolute left-0 top-0 z-[300] flex h-16 w-full items-center justify-between px-5">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {!hideBackButton && (
          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#9c2600] transition hover:bg-[#f3f4f5] active:scale-95"
            aria-label="이전 페이지로 이동"
            onClick={handleBack}
          >
            <Icon
              className="text-[24px]"
              style={{ color: "#290a00", fontVariationSettings: '"wght" 700' }}
            >
              keyboard_arrow_left
            </Icon>
          </button>
        )}
      </div>

      <div aria-hidden="true" />
    </header>
  );
};

export default Header;
