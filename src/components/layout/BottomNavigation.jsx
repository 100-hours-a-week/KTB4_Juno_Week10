import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import Icon from "@/components/common/Icon";
import {
  hasUnreadBookmarks,
  markBookmarkRead,
  subscribeBookmarkUnreadChanged,
} from "@/utils/bookmarkEvents";

const navigationItems = [
  {
    label: "홈",
    icon: "home",
    to: ROUTES.posts,
    matches: (pathname) => pathname.startsWith("/posts"),
  },
  {
    label: "소스 모아보기",
    icon: "chili",
    to: ROUTES.categories,
    matches: (pathname) => pathname.startsWith("/categories"),
  },
  {
    label: "북마크",
    icon: "bookmark",
    to: ROUTES.bookmarks,
    matches: (pathname) => pathname.startsWith("/bookmarks"),
  },
  {
    label: "마이페이지",
    icon: "person",
    to: ROUTES.profileEdit,
    matches: (pathname) => pathname.startsWith("/profile"),
  },
];

const baseClass =
  "flex min-w-[64px] flex-col items-center justify-center rounded-full px-2 py-1 transition active:scale-90";

const navIconClass =
  "flex h-6 w-6 items-center justify-center text-[24px] leading-none";

const navLabelClass =
  "mt-0.5 block h-4 whitespace-nowrap text-center text-[12px] font-semibold leading-4";

const ChiliIcon = ({ filled = false, className = "", style }) => (
  <svg
    className={className}
    style={style}
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.9"
    aria-hidden="true"
  >
    <path d="M16.7 4.2c0.2 1.6-0.4 2.9-1.9 4" />
    <path d="M16.5 4.1c1.7 0.1 3 0.9 4 2.2" />
    <path d="M16.7 7.5c2.3 2.4 1.6 6.7-1.5 9.4-3.1 2.7-7.1 3.2-9.8 1 2.7-0.1 4.7-1.1 6.2-2.9 1.6-1.9 2-4.3 1.1-6.6 1.4-0.8 2.7-1.1 4-0.9Z" />
  </svg>
);

const NavigationIcon = ({ icon, filled, className, style }) => {
  if (icon === "chili") {
    return <ChiliIcon filled={filled} className={className} style={style} />;
  }

  return (
    <Icon className={className} filled={filled} style={style}>
      {icon}
    </Icon>
  );
};

const BottomNavigation = () => {
  const activeColor = "#b71422";
  const [hasUnreadBookmark, setHasUnreadBookmark] = useState(() =>
    hasUnreadBookmarks(),
  );

  useEffect(() => {
    return subscribeBookmarkUnreadChanged((event) => {
      setHasUnreadBookmark(Boolean(event.detail?.hasUnread));
    });
  }, []);

  return (
    <nav
      className="fixed bottom-0 left-1/2 z-[150] flex min-h-[72px] w-full max-w-[430px] -translate-x-1/2 items-center justify-around rounded-t-xl bg-[#f8f9fa]/90 px-4 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] backdrop-blur-xl"
      aria-label="하단 메뉴"
    >
      {navigationItems.map((item) => {
        if (item.disabled) {
          return (
            <button
              key={item.label}
              type="button"
              className={`${baseClass} cursor-default text-[#5f5e5e]`}
              aria-label={item.label}
              disabled
            >
              <NavigationIcon className={navIconClass} icon={item.icon} />
              <span className={navLabelClass}>{item.label}</span>
            </button>
          );
        }

        return (
          <NavLink
            key={item.label}
            to={item.to}
            onClick={
              item.to === ROUTES.bookmarks ? markBookmarkRead : undefined
            }
            className={({ isActive }) =>
              `${baseClass} group ${isActive ? "" : "text-[#5f5e5e]"}`
            }
          >
            {({ isActive }) => (
              <>
                <span className="relative flex h-6 w-6 items-center justify-center">
                  <NavigationIcon
                    icon={item.icon}
                    className={`${navIconClass} ${
                      isActive ? "" : "group-hover:text-[#b71422]"
                    }`}
                    filled={isActive}
                    style={isActive ? { color: activeColor } : undefined}
                  />
                  {item.to === ROUTES.bookmarks &&
                    hasUnreadBookmark &&
                    !isActive && (
                      <span
                        className="absolute -right-1 top-0 h-1.5 w-1.5 rounded-full bg-[#ba1a1a]"
                        aria-hidden="true"
                      />
                    )}
                </span>
                <span
                  className={`${navLabelClass} ${
                    isActive ? "" : "group-hover:text-[#b71422]"
                  }`}
                  style={isActive ? { color: activeColor } : undefined}
                >
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
};

export default BottomNavigation;
