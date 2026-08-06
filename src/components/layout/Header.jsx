import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { categoryApi } from "@/api";
import { ROUTES } from "@/constants/routes";
import Icon from "@/components/common/Icon";
import ProfileMenu from "@/components/layout/ProfileMenu";

const Header = ({ variant = "board" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isProfile = variant === "profile";
  const isCategoryDetailRoute =
    location.pathname.startsWith(`${ROUTES.categories}/`);
  const categoryId = isCategoryDetailRoute
    ? location.pathname.replace(`${ROUTES.categories}/`, "")
    : "";
  const categoryNameFromState = location.state?.categoryName;
  const [categoryTitle, setCategoryTitle] = useState("");
  const defaultHeaderTitle =
    {
      [ROUTES.posts]: "홈",
      [ROUTES.categories]: "취향별 소스",
      [ROUTES.bookmarks]: "북마크",
      [ROUTES.profileEdit]: "마이페이지",
    }[location.pathname] ?? "마라보자";
  const headerTitle = categoryTitle || defaultHeaderTitle;

  useEffect(() => {
    if (!isCategoryDetailRoute) {
      setCategoryTitle("");
      return;
    }

    if (categoryNameFromState) {
      setCategoryTitle(categoryNameFromState);
      return;
    }

    let ignore = false;

    const loadCategoryTitle = async () => {
      try {
        const response = await categoryApi.getCategories();
        const category = (response.data.categories ?? []).find(
          (item) => String(item.category_id) === String(categoryId),
        );

        if (!ignore) {
          setCategoryTitle(category?.name ?? "카테고리");
        }
      } catch {
        if (!ignore) {
          setCategoryTitle("카테고리");
        }
      }
    };

    loadCategoryTitle();

    return () => {
      ignore = true;
    };
  }, [categoryId, categoryNameFromState, isCategoryDetailRoute]);

  const handleBack = () => {
    if (isProfile) {
      navigate(ROUTES.posts);
      return;
    }

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
    <header className="fixed left-1/2 top-0 z-[200] flex h-16 w-full max-w-[430px] -translate-x-1/2 items-center justify-between bg-[#f8f9fa]/95 px-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] backdrop-blur-xl">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {isProfile ? (
          <Link
            to={ROUTES.posts}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#9c2600] transition hover:bg-[#f3f4f5] active:scale-95"
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
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#9c2600] transition hover:bg-[#f3f4f5] active:scale-95"
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

        <h1 className="pointer-events-none min-w-0 truncate font-['Plus_Jakarta_Sans'] text-xl font-bold leading-7 text-[#b71422]">
          {headerTitle}
        </h1>
      </div>

      <ProfileMenu variant={variant} />
    </header>
  );
};

export default Header;
